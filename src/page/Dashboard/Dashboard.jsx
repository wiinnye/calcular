import { Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Flex w="100%" minH="100vh" bg="#fff" align="center" justify="center">
      <Flex
        w="90%"
        minH="600px"
        alignItems="center"
        justifyContent="space-around"
        bg="#FFFCDD"
        p="2rem"
        borderRadius="25px"
        boxShadow="1px 2px 2px 0px #f3efe7"
      >
        <Flex
          w="40%"
          h="300px"
          align="center"
          justify="center"
          bg="#FFDF0D"
          borderRadius="25px"
          p="2rem"
          transition="all 0.3s ease-in-out"
          _hover={{ transform: "translateY(-5px)", boxShadow: "2xl" }}
          cursor='pointer'
          onClick={ () => navigate("/tabelaNova") }
        >
          <Text fontSize="30px" fontWeight="bold" color="#3B657A">
            Nova Tabela
          </Text>
        </Flex>

        <Flex
          w="40%"
          h="300px"
          align="center"
          justify="center"
          bg="#3B657A"
          borderRadius="25px"
          p="2rem"
          transition="all 0.3s ease-in-out"
          _hover={{ transform: "translateY(-5px)", boxShadow: "2xl" }}
          cursor='pointer'
          onClick={ () => navigate("/tabelasAntigas") }
        >
          <Text fontSize="30px" fontWeight="bold" color="#fff">
            Tabelas Antigas
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
