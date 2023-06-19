import { Box, Button, Center, Container, Flex, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { NextPage } from "next";
import { useState } from "react";
import { useCheckDiary } from "../features/dashboard/hooks/useCheckDiary";
import { useTranslateDiary } from "../features/dashboard/hooks/useTranslateDiary";
import { useCurrentData } from "../utils/useCurrentDate";

const DashboardPage: NextPage = () => {
  const currentData = useCurrentData();
  const { translateDiary } = useTranslateDiary();
  const { checkDiary } = useCheckDiary();
  const [diary, inputDiary] = useState<string>("");
  const [translatedDiary, setTranslatedDiary] = useState<string>("");
  const [checkedDiary, setCheckedDiary] = useState<string>("");

  const onClickTranslateDiary = async () => {
    setTranslatedDiary("");

    await translateDiary(diary, {
      handleLLMNewToken(token) {
        setTranslatedDiary((prev) => {
          return prev + token;
        });
      },
    });
  };

  console.log(translatedDiary);

  const onClickCheckDiary = async () => {
    setCheckedDiary("");

    await checkDiary(diary, {
      handleLLMNewToken(token) {
        console.log("handleLLMNewToken", token);
        setCheckedDiary((prev) => {
          return prev + token;
        });
      },
    });
  };

  const onClickStartTalk = async () => {
    const response = await axios.get("/api/chat/create").then((res) => res.data);
    console.log(response);
  };

  return (
    <Container maxW="container.lg">
      <Flex alignItems="center" justifyContent="space-between" py="2">
        <Flex alignItems="center" gap="2">
          <Center bgColor="blue.50" borderRadius="16px" height="44px" width="44px">
            <Text fontSize="2xl">📔</Text>
          </Center>
          <Text fontSize="2xl" fontWeight="semibold">
            今日の日記
          </Text>
        </Flex>
        <Text bgColor="gray.50" borderRadius="4" px="4" py="2">
          {currentData}
        </Text>
      </Flex>
      <Textarea
        minH="200px"
        onChange={(e) => inputDiary(e.target.value)}
        placeholder="１行からでも大丈夫！"
      />

      <Flex gap="4" justifyContent="flex-end" py="2">
        <Button isDisabled={!diary} onClick={onClickTranslateDiary}>
          ✏️ 英語に直す
        </Button>
        <Button isDisabled={!diary} onClick={onClickCheckDiary}>
          添削する
        </Button>
        <Button onClick={onClickStartTalk}>AIとTalkする</Button>
      </Flex>

      {translatedDiary && (
        <Box bgColor="blue.50" borderRadius="4" minH="100px" p="4">
          <Text>{translatedDiary}</Text>
        </Box>
      )}

      {checkedDiary && (
        <Box bgColor="blue.50" borderRadius="4" minH="100px" p="4">
          <Text>{checkedDiary}</Text>
        </Box>
      )}
    </Container>
  );
};

export default DashboardPage;
