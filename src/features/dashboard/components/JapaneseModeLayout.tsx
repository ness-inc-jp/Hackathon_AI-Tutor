import { Box, Stack, Text, Flex, Button, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { toast } from "react-hot-toast";
import { useGetExtractWords } from "../hooks/useGetExtractWords";
import { useTranslateDiary } from "../hooks/useTranslateDiary";

type Props = {
  diary: string;
};

export const JapaneseModeLayout: FC<Props> = (props) => {
  const router = useRouter();
  const { diary } = props;

  const [translatedDiary, setTranslatedDiary] = useState<string>("");
  const [extractWords, setExtractWords] = useState<string>("");
  const [isExtractLoading, setIsExtractLoading] = useState<boolean>(false);
  const { translateDiary } = useTranslateDiary();
  const { getExtractWords } = useGetExtractWords();

  const onClickTranslateDiary = async () => {
    if (!diary) {
      toast.error("日記がありません");
      return;
    }

    setTranslatedDiary("");

    await translateDiary(diary, {
      handleLLMNewToken(token) {
        setTranslatedDiary((prev) => {
          return prev + token;
        });
      },
    });
  };

  const onClickGetExtractWords = async () => {
    if (!translatedDiary) {
      toast.error("翻訳された日記がありません");
      return;
    }
    setIsExtractLoading(true);

    const result = await getExtractWords(translatedDiary, {});
    setExtractWords(result);

    setIsExtractLoading(false);
  };

  const onClickStartTalk = async () => {
    if (!translatedDiary) {
      toast.error("英語の日記がありません。");
      return;
    }

    localStorage.setItem("diary", translatedDiary);
    router.push("/talk");
  };

  return (
    <Box>
      <Stack py="4">
        <Button colorScheme="green" isDisabled={!diary} onClick={onClickTranslateDiary} py="6">
          ✏️ 英語に直す
        </Button>
      </Stack>

      {translatedDiary && (
        <Stack gap="8" py="8">
          <Stack gap="2">
            <Text fontSize="xl" fontWeight="semibold">
              英語に翻訳された日記
            </Text>
            <Box
              bgColor="transparent"
              borderColor="blue.100"
              borderRadius="4"
              borderWidth="1px"
              minH="100px"
              p="4"
            >
              <Text>{translatedDiary}</Text>
            </Box>
          </Stack>

          {isExtractLoading && (
            <Flex alignItems="center" color="gray.600" gap="4" justifyContent="center" py="8">
              <Spinner />
              <Text fontSize="sm">単語を検索中</Text>
            </Flex>
          )}

          {!isExtractLoading && extractWords.length && (
            <Stack gap="2">
              <Text fontSize="xl" fontWeight="semibold">
                使われている単語
              </Text>
              <Box
                bgColor="transparent"
                borderColor="blue.100"
                borderRadius="4"
                borderWidth="1px"
                minH="100px"
                p="4"
              >
                <Text>{extractWords}</Text>
              </Box>
            </Stack>
          )}

          <Flex gap="4">
            <Button colorScheme="green" onClick={onClickGetExtractWords} w="50%">
              単語を調べる
            </Button>
            <Button colorScheme="messenger" onClick={onClickStartTalk} w="50%">
              AIとTalkする
            </Button>
          </Flex>
        </Stack>
      )}
    </Box>
  );
};
