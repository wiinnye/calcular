import {
  Button,
  Combobox,
  Flex,
  Icon,
  Input,
  Portal,
  Text,
  useFilter,
  useListCollection,
} from "@chakra-ui/react";
import ListaTabelaNova from "../../components/ListaTabelaNova/ListaTabelaNova";
import Notificacao from "../../components/Notificacao/Notificacao";
import tabelaDePreco from "../../services/mockTabeladePreco";
import { useEffect, useState } from "react";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";

export default function Tabela() {
  const [notificacao, setNotificacao] = useState(null);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [servicoSelecionado, setServicoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [erroQuantidade, setErroQuantidade] = useState("");
  const [adicionarLista, setAdicionarLista] = useState([]);
  const [totalGeral, setTotalGeral] = useState(0);

  const navigate = useNavigate();
  const dataDeHoje = new Date();

  useEffect(() => {
    const novoTotal = adicionarLista.reduce((acumulador, itemAtual) => {
      return acumulador + itemAtual.subtotal;
    }, 0);

    setTotalGeral(novoTotal);
  }, [adicionarLista]);

  const dataFormatada = dataDeHoje.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const { contains } = useFilter({ sensitivity: "base" });

  const { collection, filter } = useListCollection({
    initialItems: tabelaDePreco,
    filter: contains,
  });

  const handleSelect = (selection) => {
    const selectedValue = selection.itemValue;
    const itemCompleto = tabelaDePreco.find(
      (item) => item.value === selectedValue
    );

    if (itemCompleto) {
      setItemSelecionado(itemCompleto);
      setServicoSelecionado(itemCompleto.servico);
    }
  };

  const handleDownloadExcel = () => {
    setNotificacao({
      msg: "Fazendo Download do Excel!",
      tipo: "sucesso",
    });
    setTimeout(() => setNotificacao(""), 5000);
  };

  const criarListaItems = () => {
    if (!itemSelecionado) {
      return;
    }

    const quantidadeNumerica = parseFloat(quantidade);

    if (isNaN(quantidadeNumerica) || quantidadeNumerica <= 0) {
      setErroQuantidade(true);
      return;
    }

    const subtotalItems = quantidadeNumerica * itemSelecionado.preco_reais;

    const novoItem = {
      ...itemSelecionado,
      id: Date.now(),
      quantidade: quantidadeNumerica,
      subtotalItems,
    };

    setAdicionarLista((prevLista) => [...prevLista, novoItem]);

    setItemSelecionado(null);
    setServicoSelecionado("");
    setQuantidade("");
  };

  return (
    <Flex w="100%" minH="100vh" flexDirection="column" p="1rem">
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Flex w="100%" h="100%" p="1rem">
          <Button bg="#bebe3a" onClick={() => navigate("/home")}>
            voltar
          </Button>
        </Flex>
        <Flex w="100%" justify="space-around">
          <Flex w="100%" h="100%" p="1rem">
            <Text fontSize="25px" fontWeight="semibold">
              Data: {dataFormatada}
            </Text>
          </Flex>
          <Flex
            w="100%"
            h="100%"
            justify="flex-end"
            align="end"
            flexDirection="column"
          >
            <Button w="100px" h="50px" bg="none" onClick={handleDownloadExcel}>
              <Icon
                aria-label="Baixar Excel"
                w="50px"
                h="50px"
                color="green"
                mr="1.5rem"
                cursor="pointer"
                isRound
                onClick={handleDownloadExcel}
              >
                <LiaFileDownloadSolid size="2xl" />
              </Icon>
            </Button>
            <Text mr="2.5rem">baixar</Text>
          </Flex>
        </Flex>
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
            collection={collection}
            onInputValueChange={(e) => filter(e.inputValue)}
            onSelect={handleSelect}
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
                  {collection.items.map((item) => (
                    <Combobox.Item item={item} key={item.value}>
                      {item.servico}
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
              borderColor={!erroQuantidade ? "#fff" : "red.500"}
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              p="1rem"
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
          {/* <Select.Root collection={cores} size="sm" width="150px" p=".5rem">
            <Select.HiddenSelect />
            <Select.Label> Cores</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Selecione a cor" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {cores.items.map((cor) => (
                    <Select.Item item={cor} key={cor.value}>
                      {cor.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root> */}
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
          <Button bg="#119918" onClick={criarListaItems}>
            Adicionar
          </Button>
        </Flex>
      </Flex>

{/* ARRUMAR AQUI  */}
      {adicionarLista && (
        <ListaTabelaNova
          items={adicionarLista}
          valorTotal={totalGeral.toFixed(2)}
        />
      )}

      {notificacao && (
        <Notificacao
          msg={notificacao?.msg}
          tipo={notificacao?.tipo}
          descricao={notificacao?.descricao}
          onClose={notificacao?.onClose}
        />
      )}
    </Flex>
  );
}
