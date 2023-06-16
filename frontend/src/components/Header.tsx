import { Button, Container, Flex, Text } from "@chakra-ui/react";
import { FC } from "react";

export const Header: FC = () => {
  return (
    <Container maxW="full">
      <Flex alignItems="center" justifyContent="space-between" py="3">
        <Text>AI Tutor</Text>
        <Button>Login</Button>
      </Flex>
    </Container>
  );
};
