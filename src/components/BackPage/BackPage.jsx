import { Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function BackPage({rota}) {
    const navigate = useNavigate();

  return (
    <Flex w="100%" h="100%" p="1rem">
      <Button w='100px' bg="#FFDF0D" color='#000' onClick={() => navigate(`${rota}`)}>
        voltar
      </Button>
    </Flex>
  );
}
