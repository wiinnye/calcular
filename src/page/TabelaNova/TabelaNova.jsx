import {
  Button,
  Combobox,
  Flex,
  Input,
  Portal,
  Text,
  createListCollection,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import * as XLSX from "xlsx/xlsx.mjs";
import { saveAs } from "file-saver";

// Componentes
import ListaTabelaNova from "../../components/ListaTabelaNova/ListaTabelaNova";
import Notificacao from "../../components/Notificacao/Notificacao";
import HistoricoVendas from "../../components/HistoricoVendas/HistoricoVendas";
import ExcelDownload from "../../components/ExcelDownload/ExcelDownload";
import { BackPage } from "../../components/BackPage/BackPage";
import tabelaDePreco from "../../services/mockTabeladePreco";

export default function Tabela() {
  const [notificacao, setNotificacao] = useState(null);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [servicoSelecionado, setServicoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [erroQuantidade, setErroQuantidade] = useState(false);
  const [adicionarLista, setAdicionarLista] = useState([]);
  const [totalGeral, setTotalGeral] = useState(0);
  const [valorSelecionado, setValorSelecionado] = useState([]);
  const [historicoDeVendas, setHistoricoDeVendas] = useState([]);
  const [valorManual, setValorManual] = useState("0.00");

  // --- CONFIGURAÇÃO DO COMBOBOX (Chakra v3) ---
  const listafiltro = useMemo(() => {
  const itensFiltrados = !servicoSelecionado 
    ? tabelaDePreco 
    : tabelaDePreco.filter((item) =>
        item.servico.toLowerCase().includes(servicoSelecionado.toLowerCase())
      );

  return createListCollection({
    items: itensFiltrados,
    itemToString: (item) => item.servico,
    itemToValue: (item) => item.value,
  });
}, [servicoSelecionado]);

  // --- DATAS PARA FILTRO FIREBASE ---
  const getInicioDoDia = () => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return hoje.toISOString();
  };

  const getFimDoDia = () => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    amanha.setHours(0, 0, 0, 0);
    return amanha.toISOString();
  };

  const inicioDoDia = getInicioDoDia();
  const fimDoDia = getFimDoDia();
  const dataDeHoje = new Date();

  const dataFormatada = dataDeHoje.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formatarMoedaParaExibicao = (valor) => {
    const n = Number(valor) || 0;
    return n.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleValorChange = (e) => {
    const valorLimpo = e.target.value.replace(/\D/g, "");
    const valorNumerico = (Number(valorLimpo) / 100).toFixed(2);
    setValorManual(valorNumerico);
  };

  useEffect(() => {
    const novoTotal = adicionarLista.reduce(
      (acc, item) => acc + item.subtotal,
      0
    );
    setTotalGeral(novoTotal);
  }, [adicionarLista]);

  useEffect(() => {
    buscarHistoricoVendas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selecionarServicoValue = (details) => {
    const selectedValue = details.value[0];
    setValorSelecionado(details.value);

    if (!selectedValue) return;

    const itemCompleto = tabelaDePreco.find(
      (item) => item.value === selectedValue
    );

    if (itemCompleto) {
      setItemSelecionado(itemCompleto);
      setServicoSelecionado(itemCompleto.servico); // Define o texto no input do Combobox
      setValorManual(String(itemCompleto.preco_reais || "0.00"));

      if (itemCompleto.quantidade_fixa) {
        setQuantidade(String(itemCompleto.quantidade_fixa));
      } else {
        setQuantidade("");
      }
    }
  };

  const criarListaItems = () => {
    if (!itemSelecionado) return;

    const quantidadeNumerica = parseFloat(quantidade);
    const precoFinal = parseFloat(valorManual);

    if (isNaN(quantidadeNumerica) || quantidadeNumerica <= 0) {
      setErroQuantidade(true);
      return;
    }

    const subtotal = quantidadeNumerica * (precoFinal || 0);

    const novoItem = {
      ...itemSelecionado,
      id: Date.now(),
      quantidade: quantidadeNumerica,
      subtotal,
      precoItem: precoFinal,
      horario: new Date().toLocaleTimeString("pt-BR"),
    };

    setAdicionarLista((prev) => [...prev, novoItem]);

    // Limpar campos
    setItemSelecionado(null);
    setServicoSelecionado("");
    setValorSelecionado([]);
    setQuantidade("");
    setValorManual("0.00");
    setErroQuantidade(false);
  };

  const salvarLista = async (formaPagamentoSelecionada) => {
    if (adicionarLista.length === 0) return;

    const vendaFinal = {
      data: new Date().toISOString(),
      itens: adicionarLista,
      total: totalGeral,
      formaPagamento: formaPagamentoSelecionada,
    };

    try {
      const docRef = await addDoc(collection(db, "vendas"), vendaFinal);
      const vendaSalva = { ...vendaFinal, firebaseId: docRef.id };

      setHistoricoDeVendas((prev) => [vendaSalva, ...prev]);
      setAdicionarLista([]);
      setNotificacao({ msg: "Venda salva!", tipo: "sucesso" });
    } catch (e) {
      setNotificacao({ msg: "Erro ao salvar venda.", tipo: "erro" });
    }
  };

  const buscarHistoricoVendas = async () => {
    try {
      const q = query(
        collection(db, "vendas"),
        where("data", ">=", inicioDoDia),
        where("data", "<", fimDoDia),
        orderBy("data", "desc")
      );
      const querySnapshot = await getDocs(q);
      const historicoMapeado = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        firebaseId: doc.id,
        total: parseFloat(doc.data().total),
      }));
      setHistoricoDeVendas(historicoMapeado);
    } catch (error) {
      console.error(error);
    }
  };

  const deletarVenda = async (firebaseId) => {
    try {
      await deleteDoc(doc(db, "vendas", firebaseId));
      setHistoricoDeVendas((prev) =>
        prev.filter((v) => v.firebaseId !== firebaseId)
      );
      setNotificacao({ msg: "Venda deletada!", tipo: "sucesso" });
    } catch (e) {
      setNotificacao({ msg: "Erro ao deletar.", tipo: "erro" });
    }
  };

  const faturamentoTotal = useMemo(() => {
    return historicoDeVendas.reduce((acc, v) => acc + (v.total || 0), 0);
  }, [historicoDeVendas]);

  const exportarParaExcel = () => {
    if (historicoDeVendas.length === 0) {
      setNotificacao({
        msg: "Não há vendas no histórico para exportar.",
        tipo: "erro",
      });
      setTimeout(() => setNotificacao(null), 5000);
      return;
    }

    const dadosPlano = historicoDeVendas.map((venda) => {
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

    // Adiciona uma linha vazia de separação 
    dadosPlano.push({
      "Data e Hora": "",
      "Forma de Pagamento": "",
      "Serviços Detalhados": "",
      "Total da Venda (R$)": "",
    });

    // Adiciona a linha de Faturamento Total
    dadosPlano.push({
      "Data e Hora": "",
      "Forma de Pagamento": "",
      "Serviços Detalhados": "TOTAL FATURADO NO DIA:",
      "Total da Venda (R$)": faturamentoTotal, 
    });

    const worksheet = XLSX.utils.json_to_sheet(dadosPlano);

    // Ajuste das colunas
    worksheet["!cols"] = [
      { wch: 20 }, // Data e Hora
      { wch: 20 }, // Forma de Pagamento
      { wch: 80 }, // Serviços Detalhados
      { wch: 20 }, // Total
    ];

    // Formatação de Moeda na coluna D (índice 3)
    // O loop agora percorre até a última linha (incluindo o total)
    const currencyFormat = '"R$ "#,##0.00';
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      const cellAddress = XLSX.utils.encode_cell({ c: 3, r: R }); // Coluna D (Total)
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

    saveAs(data, `Relatorio_Vendas_${dataFormatada}.xlsx`);

    setNotificacao({
      msg: "Download do Excel concluído!",
      tipo: "sucesso",
    });
    setTimeout(() => setNotificacao(null), 5000);
  };

  return (
    <Flex
      w="100%"
      minH="100vh"
      flexDirection="column"
      p="1rem"
      cursor="default"
      userSelect="none"
    >
      <Flex w="100%" flexDirection="column" alignItems="center">
        <BackPage rota={"/home"} />
        <ExcelDownload
          dataFormatada={dataFormatada}
          exportarParaExcel={exportarParaExcel}
          historicoDeVendas={historicoDeVendas}
        />
      </Flex>

      <Flex
        w="100%"
        h="100%"
        alignItems="center"
        justify="center"
        mt="2rem"
        flexDirection={{ base: "column", lg: "row" }}
        gap="4"
      >
        {/* COMBOBOX DE SERVIÇO */}
        <Combobox.Root
          collection={listafiltro}
          value={valorSelecionado}
          onValueChange={selecionarServicoValue}
          inputValue={servicoSelecionado}
          onInputValueChange={(details) =>
            setServicoSelecionado(details.inputValue)
          }
          focusOnSelect={false}
          w={{ base: "350px", lg: "320px" }}
          h={{ base: "350px", lg: "100px" }}
        >
          <Combobox.Label
            h="40px"
            display="flex"
            alignItems="center"
            fontWeight="semibold"
            fontSize="14px"
          >
            Selecionar Serviço
          </Combobox.Label>
          <Combobox.Control>
            <Combobox.Input
              placeholder="Digite o serviço"
              size="md"
              h="32px" 
              p=".5rem"
            />
            <Combobox.IndicatorGroup>
              <Combobox.ClearTrigger
                onClick={() => setServicoSelecionado("")}
              />
              <Combobox.Trigger />
            </Combobox.IndicatorGroup>
          </Combobox.Control>
          <Portal>
            <Combobox.Positioner>
              <Combobox.Content>
                <Combobox.Empty>item não encontrado</Combobox.Empty>
                {listafiltro.items.map((item) => (
                  <Combobox.Item item={item} key={item.value}>
                    <Combobox.ItemText>{item.servico}</Combobox.ItemText>
                    <Combobox.ItemIndicator />
                  </Combobox.Item>
                ))}
              </Combobox.Content>
            </Combobox.Positioner>
          </Portal>
        </Combobox.Root>

        {/* QUANTIDADE */}
        <Flex direction="column">
          <Text
            h="32px"
            fontSize="14px"
            fontWeight="semibold"
          >
            Quantidade
          </Text>
          <Input
            w={{ base: "350px", lg: "150px" }}
            type="number"
            placeholder="Qtd"
            borderColor={erroQuantidade ? "red.500" : "inherit"}
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            p="1rem"
            disabled={!!(itemSelecionado && itemSelecionado.quantidade_fixa)}
          />
        </Flex>

        {/* VALOR EDITÁVEL COM R$ */}
        <Flex direction="column">
          <Text
            h="32px"
            fontSize="14px"
            fontWeight="semibold"
            cursor="default"
            userSelect="none"
          >
            Valor
          </Text>
          <Input
            w={{ base: "350px", lg: "180px" }}
            type="text"
            p="1rem"
            value={formatarMoedaParaExibicao(valorManual)}
            onChange={handleValorChange}
          />
        </Flex>

        <Button
          bg="#3B657A"
          color="white"
          mt={{ lg: "22px" }}
          p="1.5rem"
          onClick={criarListaItems}
        >
          Adicionar
        </Button>
      </Flex>

      {/* LISTAS E COMPONENTES INFERIORES */}
      {adicionarLista.length > 0 && (
        <ListaTabelaNova
          formatarMoedaParaExibicao={formatarMoedaParaExibicao}
          items={adicionarLista}
          valorTotal={totalGeral}
          onUpdateQuantity={(id, q) => {
            const novaLista = adicionarLista.map((i) =>
              i.id === id
                ? { ...i, quantidade: q, subtotal: q * i.precoItem }
                : i
            );
            setAdicionarLista(novaLista);
          }}
          salvarLista={salvarLista}
          deletarItems={(id) =>
            setAdicionarLista(adicionarLista.filter((i) => i.id !== id))
          }
        />
      )}

      {historicoDeVendas.length > 0 && (
        <HistoricoVendas
          historicoDeVendas={historicoDeVendas}
          faturamentoTotal={faturamentoTotal}
          deletarVenda={deletarVenda}
        />
      )}

      {notificacao && (
        <Notificacao {...notificacao} onClose={() => setNotificacao(null)} />
      )}
    </Flex>
  );
}
