import { Button, Container, Flex, Portal, Text, useDisclosure } from "@chakra-ui/react";
import { FC } from "react";
import { LoginModal } from "../features/auth/components/LoginModal";

export const Header: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Container maxW="full">
      <Flex alignItems="center" justifyContent="space-between" py="3">
        <Text>AI Tutor</Text>
        <Button onClick={onOpen}>Login</Button>
        <Portal>
          <LoginModal isOpen={isOpen} onClose={onClose} />
        </Portal>
      </Flex>
    </Container>
  );
};
