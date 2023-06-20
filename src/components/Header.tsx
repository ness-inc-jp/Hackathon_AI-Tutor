import { Button, Container, Flex, Portal, Text, useDisclosure } from "@chakra-ui/react";
// import { useSession } from "next-auth/react";
import { FC } from "react";
import { FreeTalkModeModal } from "../features/chat/components/FreeTalkModeModal";

export const Header: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Container maxW="container.xl">
      <Flex alignItems="center" justifyContent="space-between" py="3">
        <Text fontSize="xl" fontWeight="bold">
          AI Tutor
        </Text>
        <Button
          _hover={{ bgColor: "messenger.500" }}
          bgColor="messenger.400"
          borderRadius="full"
          color="white"
          onClick={onOpen}
        >
          AI Tutorとフリートーク 🎙
        </Button>
        <Portal>
          <FreeTalkModeModal isOpen={isOpen} onClose={onClose} />
        </Portal>
      </Flex>
    </Container>
  );
};
