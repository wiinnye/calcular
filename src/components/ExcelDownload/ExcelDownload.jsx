import { Button, Flex, Icon, Text } from "@chakra-ui/react";
import { LiaFileDownloadSolid } from "react-icons/lia";

export default function ExcelDownload({
  dataFormatada,
  exportarParaExcel,
  historicoDeVendas,
}) {
  return (
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
          <Button
            w="100px"
            h="50px"
            bg="none"
            onClick={exportarParaExcel}
            isDisabled={historicoDeVendas?.length === 0}
          >
            <Icon
              as={LiaFileDownloadSolid}
              w="50px"
              h="50px"
              color={historicoDeVendas?.length !== 0 ? "green" : "gray.200"}
              mr="1.5rem"
            />
          </Button>
          <Text 
          mr="2.5rem"
          color={historicoDeVendas?.length !== 0 ? "green" : "gray.200"}
          cursor='default'
          >baixar</Text>
        </Flex>
      </Flex>

  );
}
