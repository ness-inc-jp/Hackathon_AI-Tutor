import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Skeleton,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { EnglishModeLayout } from "../features/dashboard/components/EnglishModeLayout";
import { JapaneseModeLayout } from "../features/dashboard/components/JapaneseModeLayout";
import { useCheckDiary } from "../features/dashboard/hooks/useCheckDiary";
import { useCurrentData } from "../features/dashboard/hooks/useCurrentDate";
import { useGetExtractWords } from "../features/dashboard/hooks/useGetExtractWords";
import { useTranslateDiary } from "../features/dashboard/hooks/useTranslateDiary";

const DashboardPage: NextPage = () => {
  const router = useRouter();
  const { currentDate } = useCurrentData();
  const { translateDiary } = useTranslateDiary();
  const { getExtractWords } = useGetExtractWords();
  const { checkDiary } = useCheckDiary();
  const [diary, inputDiary] = useState<string>("");
  const [translatedDiary, setTranslatedDiary] = useState<string>("");
  const [extractWords, setExtractWords] = useState<string>("");
  const [checkedDiary, setCheckedDiary] = useState<string>("");
  const [isEnglishMode, setIsEnglishMode] = useState<boolean>(true);

  const onClickChangeLanguageMode = () => {
    setIsEnglishMode((prev) => {
      return !prev;
    });
  };

  return (
    <Container maxW="container.lg">
      {currentDate ? (
        <Text color="gray.800" fontSize="4xl" fontWeight="semibold" pb="4">
          {currentDate}
        </Text>
      ) : (
        <Skeleton />
      )}

      <Flex alignItems="center" justifyContent="space-between" py="4">
        <Flex alignItems="center" gap="4">
          <Center bgColor="blue.50" borderRadius="16px" height="56px" width="56px">
            <Text fontSize="2xl">📔</Text>
          </Center>

          <Stack gap="1">
            <Text fontSize="2xl" fontWeight="semibold">
              今日の日記
            </Text>
            <Text color="gray.500" fontSize="sm">
              {isEnglishMode
                ? "今日はどんなことがあった？知っている英語で書いてみよう。"
                : "今日はどんなことがあった？まずは日本語で書いてみよう"}
            </Text>
          </Stack>
        </Flex>
        <Stack gap="1">
          <Text color="gray.600" fontSize="xs">
            現在の入力モード
          </Text>
          <Button bgColor="gray.50" borderRadius="8" onClick={onClickChangeLanguageMode}>
            {isEnglishMode ? "英語" : "日本語"}
          </Button>
        </Stack>
      </Flex>

      <Textarea
        bgColor="gray.50"
        minH="300px"
        onChange={(e) => inputDiary(e.target.value)}
        placeholder="１行からでも大丈夫！"
        value={diary}
      />

      {isEnglishMode ? <EnglishModeLayout diary={diary} /> : <JapaneseModeLayout diary={diary} />}

      {checkedDiary && (
        <Box bgColor="blue.50" borderRadius="4" minH="100px" p="4">
          <Text>{checkedDiary}</Text>
        </Box>
      )}
    </Container>
  );
};

export default DashboardPage;
