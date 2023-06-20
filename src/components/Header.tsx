import {
  Button,
  Container,
  Flex,
  Portal,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
// import { useSession } from "next-auth/react";
import { useSession } from "next-auth/react";
import { FC } from "react";
import { LoginModal } from "../features/auth/components/LoginModal";

export const Header: FC = () => {
  const { data: session, status } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  console.log(session);
  return (
    <Container maxW="full">
      <Flex alignItems="center" justifyContent="space-between" py="3">
        <Text>AI Tutor</Text>
        {session && session.user?.id ? (
          <Button onClick={onOpen}>{session.user.name}</Button>
        ) : (
          <Button isLoading={status === "loading"} onClick={onOpen}>
            Login
          </Button>
        )}
        <Portal>
          <LoginModal isOpen={isOpen} onClose={onClose} />
        </Portal>
      </Flex>
    </Container>
  );
};