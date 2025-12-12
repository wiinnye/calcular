import {
  Button,
  Flex,
  Input,
  Portal,
  Select,
  Table,
  Text,
  Icon,
  useFilter,
  useListCollection,
} from "@chakra-ui/react";
import { useState } from "react";
import pagamentos from "../../services/pagamentos";
import { FaTrash } from "react-icons/fa";

export default function ListaTabelaNova({
  items,
  valorTotal,
  onUpdateQuantity,
  salvarLista,
  deletarItems,
}) {
  const [formaPagamento, setFormaPagamento] = useState(null);
  const { contains } = useFilter({ sensitivity: "base" });

  const { collection, filter } = useListCollection({
    initialItems: pagamentos,
    filter: contains,
  });

  const selecionarValorPagamentos = (selection) => {
    const selectedValue = selection.value;
    const itemCompleto = pagamentos.find(
      (item) => item.value === selectedValue
    );

    if (itemCompleto) {
      setFormaPagamento(itemCompleto.label);
    }
  };

  const temObservacao = items.some(
    (item) => item.observacao && item.observacao.trim() !== ""
  );

  const salvarListaFinal = () => {
    if (!formaPagamento) {
      console.log("Selecione uma Forma de Pagamento!");
      return;
    }

    salvarLista(formaPagamento);
  };

  return (
    <Flex h="100%" align="center" justify="center" flexDirection="column">
      <Flex
        w="100%"
        align="center"
        justify="center"
        flexDirection="column"
        mt={{ base: "1rem", lg: "0" }}
      >
        <Flex
          w={{ base: "100%", lg: "60%" }}
          mt="1rem"
          justify="space-around"
          flexDirection={{ base: "column", lg: "row" }}
        >
          <Flex w="100%" justify="center" align="center">
            <Table.ScrollArea
              rounded="md"
              maxH="160px"
              minW="200px"
              maxW="700px"
            >
              <Table.Root size="sm" stickyHeader striped>
                <Table.Header>
                  <Table.Row bg="bg.subtle">
                    <Table.ColumnHeader>Serviços</Table.ColumnHeader>
                    <Table.ColumnHeader>Quantidade</Table.ColumnHeader>
                    {temObservacao && (
                      <Table.ColumnHeader>Observação</Table.ColumnHeader>
                    )}
                    <Table.ColumnHeader textAlign="end">
                      Valor
                    </Table.ColumnHeader>
                    <Table.ColumnHeader>Excluir</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {items.map((item, index) => (
                    <Table.Row key={item.id || index}>
                      <Table.Cell>{item.servico}</Table.Cell>
                      <Table.Cell>
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          defaultValue={item.quantidade}
                          onBlur={(event) =>
                            onUpdateQuantity(item.id, event.target.value)
                          }
                          w="100px"
                          textAlign="center"
                        />
                      </Table.Cell>
                      {temObservacao && (
                        <Table.ColumnHeader>
                          {item.observacao}
                        </Table.ColumnHeader>
                      )}
                      <Table.Cell textAlign="end">
                        R$ {item.precoItem.toFixed(2)}
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          size="sm"
                          variant="ghost"
                          color="red"
                          onClick={() => deletarItems(item.id)}
                        >
                          <Icon as={FaTrash} />
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          </Flex>

          <Flex
            w={{ base: "100%", lg: "50%" }}
            mt={{ base: "1rem", lg: ".5rem" }}
          >
            <Select.Root
              size="md"
              w="300px"
              ml="1rem"
              collection={collection}
              onInputValueChange={(e) => filter(e.inputValue)}
              onSelect={selecionarValorPagamentos}
            >
              <Select.HiddenSelect />
              <Select.Label> Forma de Pagamento</Select.Label>
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Selecione" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {pagamentos.map((pagamento) => (
                      <Select.Item item={pagamento} key={pagamento.value}>
                        {pagamento.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Flex>

          <Flex
            w={{ base: "100%", lg: "50%" }}
            p={{ base: "0", lg: "1rem" }}
            mt={{ base: "0", lg: "1rem" }}
            justify="center"
          >
            <Button
              w={{ base: "380px", lg: "200px" }}
              mt={{ base: "1rem", lg: "0" }}
              bg="#119918"
              onClick={salvarListaFinal}
            >
              Salvar
            </Button>
          </Flex>
        </Flex>

        <Flex mt="1rem" align="center">
          <Text fontSize="25px" fontWeight="bold">
            Valor Total: R$ {valorTotal.toFixed(2)}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
