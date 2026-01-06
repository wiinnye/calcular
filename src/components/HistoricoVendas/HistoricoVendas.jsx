import { Button, Flex, Icon, Text } from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";

export default function HistoricoVendas({
  historicoDeVendas,
  faturamentoTotal,
  deletarVenda,
}) {
  const totalFormatado = faturamentoTotal?.toFixed(2).replace(".", ",");

  const formatarHora = (dataISO) => {
    return new Date(dataISO).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <Flex flexDirection="column" mt="3rem" p="1rem">
      <Text fontSize="2xl" fontWeight="bold" mb="1rem">
        Vendas do Dia
      </Text>

      <Flex flexDirection="column" maxH="400px" overflowY="auto" p="1">
        {historicoDeVendas.map((venda) => (
          <Flex
            key={venda.id}
            // flexDirection="column"
            p="4"
            borderWidth="1px"
            borderRadius="md"
            mb="3"
            justifyContent="space-between"
          >
            <Flex flexDirection="column">
              <Text fontWeight="semibold">
                  <Text fontSize="sm" color="blue.600" fontWeight="bold" mb="1">
                    Venda às {formatarHora(venda.data)}
                  </Text>
              
              </Text>
              <Text fontSize="sm">Pagamento: {venda.formaPagamento}</Text>
              {venda.itens.map((item, itemIndex) => (
                <Text key={item.id || itemIndex} fontSize="sm">
                  • {item.servico} (x{item.quantidade}) - R${" "}
                  {item.subtotal.toFixed(2).replace(".", ",")}
                </Text>
              ))}
              <Text fontSize="sm">Total de Itens: {venda.itens.length}</Text>
            </Flex>
             <Flex  justifyContent="space-between" direction='column'>
              <Flex>
                <Text fontSize="xl" fontWeight="extrabold" color="green.500">
                  R$ {venda.total.toFixed(2).replace(",", ".")}
                </Text>
              </Flex>

              <Button
                size="sm"
                color="red"
                align='end'
                variant="ghost"
                onClick={() => deletarVenda(venda.firebaseId)}
                disabled={!venda.firebaseId}
                title="Deletar Venda do Histórico"
              >
                <Icon as={FaTrash} w={4} h={4} />
              </Button>
            </Flex>

          </Flex>
        ))}
      </Flex>
      <Flex
        w="100%"
        p="4"
        bg="blue.50"
        borderWidth="2px"
        borderColor="blue.400"
        borderRadius="md"
        mt="4"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize="2xl" fontWeight="bold" color="blue.700">
          Faturamento Total:
        </Text>
        <Text fontSize="2xl" fontWeight="extrabold" color="blue.700">
          R$ {totalFormatado}
        </Text>
      </Flex>
    </Flex>
  );
}
