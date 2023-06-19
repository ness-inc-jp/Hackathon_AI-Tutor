import { Button, Container, Flex, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { trpc } from "@/src/utils";
import { useUserEdit } from "../features/user/hooks/useUserEdit";

const SettingPage: NextPage = () => {
  const { data: session, status, update } = useSession();
  const { editUserName } = useUserEdit();
  const [name, setName] = useState<string>("");

  const updateUserMutation = trpc.user.updateUser.useMutation({
    onSuccess: () => {
      toast.success("ユーザー情報を更新しました");
      update();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (session && session.user) {
      setName(session.user.name ? session.user.name : "");
    }
  }, [session]);

  const onClickSave = async () => {
    if (!session) return;
    await updateUserMutation.mutateAsync({ name: name });
  };

  return (
    <Container maxW="container.md">
      <Heading>Setting</Heading>
      <Stack gap="4" py="8">
        <Stack>
          <Text>UserName</Text>
          <Input onChange={(e) => setName(e.target.value)} value={name} />
        </Stack>
        <Stack>
          <Text>Email</Text>
          <Input contentEditable="false" />
        </Stack>

        <Flex justifyContent="flex-end" py="8">
          <Button colorScheme="messenger" isDisabled={!name} onClick={onClickSave}>
            保存
          </Button>
        </Flex>
      </Stack>
    </Container>
  );
};

export default SettingPage;
