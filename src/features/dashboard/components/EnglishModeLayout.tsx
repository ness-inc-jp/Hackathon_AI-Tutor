import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { useCheckDiary } from "../hooks/useCheckDiary";

type Props = {
  diary: string;
};

export const EnglishModeLayout: FC<Props> = (props) => {
  const router = useRouter();
  const { diary } = props;
  const { checkDiary } = useCheckDiary();
  const [checkedDiary, setCheckedDiary] = useState<string>("");

  const onClickTranslateDiary = async () => {
    setCheckedDiary("");

    await checkDiary(diary, {
      handleLLMNewToken(token) {
        setCheckedDiary((prev) => {
          return prev + token;
        });
      },
      async handleLLMEnd(text) {},
    });
  };

  const onClickStartTalk = () => {
    localStorage.setItem("diary", diary);
    router.push("/talk");
  };

  return (
    <Box>
      <Stack py="4">
        <Button colorScheme="green" isDisabled={!diary} onClick={onClickTranslateDiary} py="6">
          ✏️ AIに添削してもらう
        </Button>
      </Stack>

      {checkedDiary && (
        <Stack gap="8" py="8">
          <Stack gap="2">
            <Text fontSize="xl" fontWeight="semibold">
              AIによる添削
            </Text>
            <Box
              bgColor="transparent"
              borderColor="blue.100"
              borderRadius="4"
              borderWidth="1px"
              minH="100px"
              p="4"
            >
              <Text>{checkedDiary}</Text>
            </Box>
          </Stack>

          <Flex gap="4">
            <Button colorScheme="messenger" onClick={onClickStartTalk} w="100%">
              AIとTalkする
            </Button>
          </Flex>
        </Stack>
      )}
    </Box>
  );
};
