import { Button, Combobox, Flex, Input, Portal, Text } from "@chakra-ui/react";
import ListaTabelaNova from "../../components/ListaTabelaNova/ListaTabelaNova";
import Notificacao from "../../components/Notificacao/Notificacao";
import tabelaDePreco from "../../services/mockTabeladePreco";
import HistoricoVendas from "../../components/HistoricoVendas/HistoricoVendas";
import ExcelDownload from "../../components/ExcelDownload/ExcelDownload";
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
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx/xlsx.mjs";
import { saveAs } from "file-saver";
import { BackPage } from "../../components/BackPage/BackPage";

export default function Tabela() {
  const [notificacao, setNotificacao] = useState(null);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [servicoSelecionado, setServicoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [erroQuantidade, setErroQuantidade] = useState("");
  const [adicionarLista, setAdicionarLista] = useState([]);
  const [totalGeral, setTotalGeral] = useState(0);
  const [historicoDeVendas, setHistoricoDeVendas] = useState([]);

  const getInicioDoDia = () => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // 00:00:00.000
    return hoje.toISOString(); // Retorna no formato de string ISO
  };

  const getFimDoDia = () => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    amanha.setHours(0, 0, 0, 0); // 00:00:00.000 do próximo dia
    return amanha.toISOString(); // Retorna no formato de string ISO
  };

  const inicioDoDia = getInicioDoDia();
  const fimDoDia = getFimDoDia();

  const dataDeHoje = new Date();

  useEffect(() => {
    const novoTotal = adicionarLista.reduce((acumulador, itemAtual) => {
      return acumulador + itemAtual.subtotal;
    }, 0);

    setTotalGeral(novoTotal);
  }, [adicionarLista]);

  useEffect(() => {
    buscarHistoricoVendas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dataFormatada = dataDeHoje.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const horarioFormatado = dataDeHoje.toLocaleDateString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const selecionarServicoValue = (selection) => {
    const selectedValue = selection.itemValue;
    const itemCompleto = tabelaDePreco.find(
      (item) => item.value === selectedValue
    );

    if (itemCompleto) {
      setItemSelecionado(itemCompleto);
      setServicoSelecionado(itemCompleto.servico);

      if (itemCompleto.quantidade_fixa) {
        setQuantidade(String(itemCompleto.quantidade_fixa));
      } else {
        setQuantidade("");
        setServicoSelecionado("");
      }
    }
  };

  const atualizarQuantidade = (itemId, novaQuantidade) => {
    const quantidadeNumerica = parseFloat(novaQuantidade);
    if (isNaN(quantidadeNumerica) || quantidadeNumerica <= 0) {
      console.error("Quantidade inválida.");
      return;
    }

    const listaAtualizada = adicionarLista.map((item) => {
      if (item.id === itemId) {
        const novoSubtotal = quantidadeNumerica * item.preco_reais;

        return {
          ...item,
          quantidade: quantidadeNumerica,
          subtotal: novoSubtotal,
        };
      }

      return item;
    });
    setAdicionarLista(listaAtualizada);
  };

  const faturamentoTotal = useMemo(() => {
    return historicoDeVendas.reduce((acumulador, vendaAtual) => {
      return acumulador + (vendaAtual.total || 0);
    }, 0);
  }, [historicoDeVendas]);

  const criarListaItems = () => {
    if (!itemSelecionado) {
      return;
    }

    const quantidadeNumerica = parseFloat(quantidade);

    if (isNaN(quantidadeNumerica) || quantidadeNumerica <= 0) {
      setErroQuantidade(true);
      return;
    }

    const subtotal = quantidadeNumerica * itemSelecionado.preco_reais;

    const novoItem = {
      ...itemSelecionado,
      id: Date.now(),
      quantidade: quantidadeNumerica,
      subtotal,
      precoItem: itemSelecionado.preco_reais,
      horario: horarioFormatado,
    };

    setAdicionarLista((prevLista) => [...prevLista, novoItem]);

    setItemSelecionado(null);
    setServicoSelecionado("");
    setQuantidade("");
  };

  const deletarItems = (itemId) => {
    const listaAtualizada = adicionarLista.filter((item) => item.id !== itemId);
    setAdicionarLista(listaAtualizada);
  };

  const salvarLista = async (formaPagamentoSelecionada) => {
    if (adicionarLista.length === 0) {
      return;
    }

    const vendaFinal = {
      data: new Date().toISOString(),
      itens: adicionarLista,
      total: totalGeral,
      formaPagamento: formaPagamentoSelecionada,
    };

    try {
      const vendasCollectionRef = collection(db, "vendas");

      const docRef = await addDoc(vendasCollectionRef, vendaFinal);

      const vendaSalva = { ...vendaFinal, firebaseId: docRef.id };

      setHistoricoDeVendas((prevHistorico) => [vendaSalva, ...prevHistorico]);
      setAdicionarLista([]);

      setNotificacao({
        msg: "Venda salva!",
        tipo: "sucesso",
      });
    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
      setNotificacao({
        msg: "Erro ao salvar venda.",
        tipo: "erro",
      });
    }
  };

  const buscarHistoricoVendas = async () => {
    try {
      const vendasCollectionRef = collection(db, "vendas");

      const q = query(
        vendasCollectionRef,
        where("data", ">=", inicioDoDia),
        where("data", "<", fimDoDia),
        orderBy("data", "desc")
      );

      const data = await getDocs(q);

      const historicoMapeado = data.docs.map((doc) => ({
        ...doc.data(),
        firebaseId: doc.id,
        total: parseFloat(doc.data().total),
      }));

      setHistoricoDeVendas(historicoMapeado);
    } catch (error) {
      console.error("Erro ao buscar histórico de vendas:", error);
      setNotificacao({
        msg: "Erro ao carregar dados do Firebase.",
        tipo: "erro",
      });
    }
  };

  const deletarVenda = async (firebaseId) => {
    // if (!window.confirm("Tem certeza que deseja deletar esta venda do histórico?")) {
    //     return;
    // }

    try {
        const documentoRef = doc(db, "vendas", firebaseId); 

        await deleteDoc(documentoRef);

        setHistoricoDeVendas((prevHistorico) => 
            prevHistorico.filter(venda => venda.firebaseId !== firebaseId)
        );

        setNotificacao({
            msg: "Venda deletada com sucesso!",
            tipo: "sucesso",
        });

    } catch (e) {
        console.error("Erro ao deletar documento: ", e);
        setNotificacao({
            msg: "Erro ao deletar venda. Tente novamente.",
            tipo: "erro",
        });
    }
};

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
      const dataFormatada = new Date(venda.data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const listaServicos = venda.itens
        .map((item) => {
          return `${item.servico}`;
        })
        .join(" | ");

      return {
        "Data e Hora": dataFormatada,
        "Forma de Pagamento": venda.formaPagamento,
        "Serviços Detalhados": listaServicos,
        "Total da Venda (R$)": venda.total.toFixed(2).replace(".", ","),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dadosPlano);

    worksheet["!cols"] = [
      { wch: 20 }, // Coluna B: Data e Hora
      { wch: 20 }, // Coluna C: Forma de Pagamento
      { wch: 80 }, // Coluna D: Serviços Detalhados (Aumente a largura)
      { wch: 20 }, // Coluna E: Total da Venda
    ];

    const currencyFormat = "0.00";
    for (let R = 1; R < dadosPlano.length + 1; ++R) {
      const cellE = XLSX.utils.encode_cell({ c: 4, r: R });
      if (worksheet[cellE]) worksheet[cellE].z = currencyFormat;
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
    saveAs(data, `saldo ${dataFormatada}.xlsx`);

    setNotificacao({
      msg: "Download do Excel (.xlsx) iniciado!",
      tipo: "sucesso",
    });
    setTimeout(() => setNotificacao(null), 5000);
  };

  return (
    <Flex w="100%" minH="100vh" flexDirection="column" p="1rem">
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <BackPage rota={"/"} />

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
        mt={{ base: "1.4rem", md: "0" }}
        flexDirection={{ base: "column", md: "column", lg: "row" }}
      >
        <Flex
          w="100%"
          h="300px"
          align="center"
          justify="center"
          flexDirection={{ base: "column", md: "column", lg: "row" }}
          p="1rem"
        >
          <Combobox.Root
            onSelect={selecionarServicoValue}
            inputValue={servicoSelecionado}
            onInputChange={(e) => setServicoSelecionado(e.target.value)}
            w={{ base: "350px", lg: "320px" }}
          >
            <Combobox.Label>Selecionar Serviço</Combobox.Label>
            <Combobox.Control>
              <Combobox.Input placeholder="Digite o serviço" />
              <Combobox.IndicatorGroup>
                <Combobox.ClearTrigger />
                <Combobox.Trigger />
              </Combobox.IndicatorGroup>
            </Combobox.Control>
            <Portal>
              <Combobox.Positioner>
                <Combobox.Content>
                  <Combobox.Empty>item não encontrado</Combobox.Empty>
                  {tabelaDePreco.map((tabela) => (
                    <Combobox.Item item={tabela} key={tabela.value}>
                      {tabela.servico}
                      <Combobox.ItemIndicator />
                    </Combobox.Item>
                  ))}
                </Combobox.Content>
              </Combobox.Positioner>
            </Portal>
          </Combobox.Root>

          <Flex direction="column" p="1rem">
            <Text fontSize="14px" color="#000" fontWeight="semibold">
              Quantidade
            </Text>
            <Input
              w={{ base: "350px", lg: "200px" }}
              placeholder="Quantidade"
              borderColor={!erroQuantidade ? "none" : "red.500"}
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              p="1rem"
              isDisabled={itemSelecionado && itemSelecionado.quantidade_fixa}
            />
          </Flex>
          <Flex direction="column" p="1rem">
            <Text fontSize="14px" color="#000" fontWeight="semibold">
              Valor
            </Text>
            <Input
              w={{ base: "350px", lg: "200px" }}
              type="text"
              placeholder="R$"
              p="1rem"
              value={
                itemSelecionado &&
                itemSelecionado.preco_reais !== undefined &&
                itemSelecionado.preco_reais !== null
                  ? `R$ ${itemSelecionado.preco_reais
                      .toFixed(2)
                      .replace(".", ",")}`
                  : ""
              }
              readOnly
            />
          </Flex>

          <Flex w={{ lg: "300px" }} direction="column">
            <Text fontSize="14px" color="#000" fontWeight="semibold">
              Observação
            </Text>
            <Input
              w={{ base: "350px", lg: "320px" }}
              type="text"
              placeholder="observação"
              p="1rem"
            />
          </Flex>
        </Flex>

        <Flex
          w={{ base: "380px", lg: "300px" }}
          direction="column"
          p="1rem"
          mt="1rem"
        >
          <Button bg="#3B657A" onClick={criarListaItems}>
            Adicionar
          </Button>
        </Flex>
      </Flex>

      {adicionarLista.length > 0 && (
        <ListaTabelaNova
          items={adicionarLista}
          valorTotal={totalGeral}
          onUpdateQuantity={atualizarQuantidade}
          salvarLista={salvarLista}
          historicoDeVendas={historicoDeVendas}
          deletarItems={deletarItems}
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
        <Notificacao
          msg={notificacao?.msg}
          tipo={notificacao?.tipo}
          descricao={notificacao?.descricao}
          onClose={() => setNotificacao(null)}
        />
      )}
    </Flex>
  );
}
