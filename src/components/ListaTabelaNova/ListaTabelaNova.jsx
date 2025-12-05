import { Button, createListCollection, Flex, Portal, Select, Table, Text } from "@chakra-ui/react";

export default function ListaTabelaNova({ items, valorTotal }) {
  return (
    <Flex h="100%" align="center" justify="center" flexDirection="column">
      <Flex
        w="100%"
        align="center"
        justify="center"
        flexDirection="column"
        mt={{ base: "1rem", lg: "0" }}
      >
        <Flex w="100%" mt="1rem" justify='center' flexDirection={{base:'column', lg:'row'}}>
          <Flex w="100%" justify="center" align="center">
            <Table.ScrollArea
              rounded="md"
              minH="160px"
              minW="200px"
            >
              <Table.Root size="sm" stickyHeader striped>
                <Table.Header>
                  <Table.Row bg="bg.subtle">
                    <Table.ColumnHeader>Serviços</Table.ColumnHeader>
                    <Table.ColumnHeader>Cor</Table.ColumnHeader>
                    <Table.ColumnHeader>Quantidade</Table.ColumnHeader>
                    <Table.ColumnHeader>Observação</Table.ColumnHeader>
                    <Table.ColumnHeader>Forma de Pagamento</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">
                      Valor
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {items.map((item, index) => (
                    <Table.Row key={item.id || index}>
                      <Table.Cell>{item.servico}</Table.Cell>
                      <Table.Cell>{item.cor}</Table.Cell>
                      <Table.Cell>{item.quantidade}</Table.Cell>
                      <Table.Cell>{item.observacao}</Table.Cell>
                      <Table.Cell>{item.servico}</Table.Cell>
                      <Table.Cell textAlign="end">
                        {item.subtotalItems.toFixed(2)}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          </Flex>

          <Flex w={{ base: "100%", lg: "50%" }} mt={{base:"1rem",lg:'.5rem'}} >
            <Select.Root
              collection={pagamentos}
              size="md"
              w="300px"
              ml="1rem"
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
                    {pagamentos.items.map((pagamento) => (
                      <Select.Item item={pagamento} key={pagamento.value} >
                        {pagamento.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Flex>

          <Flex w={{ base: "100%", lg: "50%" }} p={{base:"0",lg:'1rem'}} mt={{base:"0",lg:'1rem'}} justify='center'>
            <Button  w={{ base: "380px", lg: "200px" }} mt={{ base: "1rem", lg: "0" }} bg="#119918">
              Salvar
            </Button>
          </Flex>
        </Flex>

        <Flex mt="1rem" align="center">
          <Text fontSize="25px" fontWeight="bold">
            Valor Total: {valorTotal}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}

const pagamentos = createListCollection({
  items: [
    { label: "Pix", value: "pix" },
    { label: "Débito", value: "debito" },
    { label: "Credito", value: "credito" },
    { label: "Dinheiro", value: "dinheiro" },
  ],
});