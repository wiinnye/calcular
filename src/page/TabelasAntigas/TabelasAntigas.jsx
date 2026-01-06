import { useEffect, useState, useMemo } from "react";
import { Flex, Text, Input, Box, Button, Spinner } from "@chakra-ui/react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../../services/firebase";
import * as XLSX from "xlsx/xlsx.mjs";
import { saveAs } from "file-saver";
import { BackPage } from "../../components/BackPage/BackPage";
import HistoricoVendas from "../../components/HistoricoVendas/HistoricoVendas";
import Notificacao from "../../components/Notificacao/Notificacao";

export default function TabelasAntigas() {
  const [vendas, setVendas] = useState([]);
  const [dataFiltro, setDataFiltro] = useState("");
  const [loading, setLoading] = useState(false);
  const [notificacao, setNotificacao] = useState(null);

  
  const buscarVendasAntigas = async (dataSelecionada) => {
    setLoading(true);
    try {
      let q;
      const vendasRef = collection(db, "vendas");

      if (dataSelecionada) {
        const inicio = new Date(dataSelecionada + "T00:00:00").toISOString();
        const fim = new Date(dataSelecionada + "T23:59:59").toISOString();

        q = query(
          vendasRef,
          where("data", ">=", inicio),
          where("data", "<=", fim),
          orderBy("data", "desc")
        );
      } else {
        q = query(vendasRef, orderBy("data", "desc"));
      }

      const querySnapshot = await getDocs(q);
      const dados = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        firebaseId: doc.id,
        total: parseFloat(doc.data().total || 0),
      }));
      setVendas(dados);
    } catch (error) {
      console.error(error);
      setNotificacao({ msg: "Erro ao carregar dados", tipo: "erro" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarVendasAntigas();
  }, []);


  const faturamentoTotal = useMemo(() => {
    return vendas.reduce((acc, v) => acc + (v.total || 0), 0);
  }, [vendas]);

 const exportarParaExcel = () => {
  if (vendas.length === 0) {
    setNotificacao({
      msg: "Não há vendas no histórico para exportar.",
      tipo: "erro",
    });
    setTimeout(() => setNotificacao(null), 5000);
    return;
  }

  const dadosPlano = vendas.map((venda) => {
    const dataVenda = new Date(venda.data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const listaServicos = venda.itens.map((item) => item.servico).join(" | ");

    return {
      "Data e Hora": dataVenda,
      "Forma de Pagamento": venda.formaPagamento,
      "Serviços Detalhados": listaServicos,
      "Total da Venda (R$)": venda.total,
    };
  });

  dadosPlano.push({
    "Data e Hora": "",
    "Forma de Pagamento": "",
    "Serviços Detalhados": "",
    "Total da Venda (R$)": "",
  });

  dadosPlano.push({
    "Data e Hora": "",
    "Forma de Pagamento": "",
    "Serviços Detalhados": "TOTAL FATURADO NO PERÍODO:",
    "Total da Venda (R$)": faturamentoTotal,
  });

  const worksheet = XLSX.utils.json_to_sheet(dadosPlano);

  worksheet["!cols"] = [
    { wch: 20 }, // Data e Hora
    { wch: 20 }, // Forma de Pagamento
    { wch: 80 }, // Serviços Detalhados
    { wch: 20 }, // Total
  ];

  const currencyFormat = '"R$ "#,##0.00';
  const range = XLSX.utils.decode_range(worksheet["!ref"]);

  for (let R = range.s.r + 1; R <= range.e.r; ++R) {
    const cellAddress = XLSX.utils.encode_cell({ c: 3, r: R }); // Coluna D
    if (
      worksheet[cellAddress] &&
      typeof worksheet[cellAddress].v === "number"
    ) {
      worksheet[cellAddress].t = "n";
      worksheet[cellAddress].z = currencyFormat;
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Vendas Resumidas");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const nomeArquivo = dataFiltro 
    ? `Relatorio_Vendas_${dataFiltro.split('-').reverse().join('-')}.xlsx` 
    : `Relatorio_Vendas_Geral.xlsx`;

  saveAs(data, nomeArquivo);

  setNotificacao({
    msg: "Download do Excel concluído!",
    tipo: "sucesso",
  });
  setTimeout(() => setNotificacao(null), 5000);
};

  return (
    <Flex flexDirection="column" p="1rem" minH="100vh" bg="gray.50" userSelect="none">
      <BackPage rota="/home" />

      <Flex flexDirection="column" alignItems="center" mt="1rem">
        <Text fontSize="2xl" fontWeight="bold" color="#3B657A" cursor='default'>
          Histórico Geral
        </Text>

        {/* Painel de Filtros */}
        <Flex
          bg="white"
          p="4"
          borderRadius="md"
          shadow="sm"
          gap="4"
          mt="4"
          alignItems="end"
          flexDirection={{ base: "column", md: "row" }}
        >
          <Box>
            <Text fontSize="xs" fontWeight="bold" mb="1">
              Filtrar por data:
            </Text>
            <Input
              type="date"
              size="sm"
              value={dataFiltro}
              onChange={(e) => setDataFiltro(e.target.value)}
            />
          </Box>
          <Button
            size="sm"
            bg="#3B657A"
            onClick={() => buscarVendasAntigas(dataFiltro)}
          >
            Filtrar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={exportarParaExcel}
            disabled={vendas.length === 0}
          >
            Baixar Excel
          </Button>
        </Flex>

        {loading ? (
          <Spinner mt="10" />
        ) : (
          <Box w="100%" maxW="1000px" mt="6">
            <HistoricoVendas
              historicoDeVendas={vendas}
              faturamentoTotal={faturamentoTotal}
              deletarVenda={() => {}}
            />
          </Box>
        )}
      </Flex>

      {notificacao && (
        <Notificacao {...notificacao} onClose={() => setNotificacao(null)} />
      )}
    </Flex>
  );
}
