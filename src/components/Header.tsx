import { Button, Container, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
// import { useSession } from "next-auth/react";
import { FC } from "react";

export const Header: FC = () => {
  const router = useRouter();

  const onClickFreeTalk = () => {
    localStorage.removeItem("diary");
    router.push("/talk");
  };

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
          onClick={onClickFreeTalk}
        >
          AI Tutorとフリートーク 🎙
        </Button>
      </Flex>
    </Container>
  );
};
