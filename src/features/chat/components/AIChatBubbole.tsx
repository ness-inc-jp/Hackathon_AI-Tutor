import { Box, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { LanguageIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import { useTranslate } from "../hooks/useTranslate";
import { AIChatMessage } from "../types/ChatMessage";

interface Props {
  message: AIChatMessage;
  onClickSpeaker: (audioUrl: string) => void;
}

export const AiChatBubble: FC<Props> = (props) => {
  const { message, onClickSpeaker } = props;
  const { translate } = useTranslate();
  const [japaneseContent, setJapaneseContent] = useState<string>("");

  const onClickTranslate = async () => {
    if (japaneseContent !== "") return;

    await translate(message.content, {
      handleLLMNewToken(token) {
        setJapaneseContent((prev) => {
          return prev + token;
        });
      },
    });
  };

  return (
    <Flex justifyContent="flex-start">
      <Stack gap="1">
        <Box
          bgColor="pink.400"
          borderRadius="18"
          borderTopLeftRadius="0"
          color="white"
          px="4"
          py="3"
        >
          <Text>{message.content}</Text>
          {japaneseContent && (
            <Text color="whiteAlpha.700" pt="1">
              {japaneseContent}
            </Text>
          )}
        </Box>

        <Flex gap="2" pl="2">
          {message.audioUrl && (
            <Flex
              alignItems="center"
              bgColor="pink.400"
              borderRadius="full"
              cursor="pointer"
              gap="1"
              onClick={() => onClickSpeaker(message.audioUrl ? message.audioUrl : "")}
              opacity="0.75"
              px="2"
            >
              <Icon as={SpeakerWaveIcon} color="white" />
              <Text color="white" fontSize="xs">
                音声を聞く
              </Text>
            </Flex>
          )}

          <Flex
            alignItems="center"
            bgColor="pink.400"
            borderRadius="full"
            cursor="pointer"
            gap="1"
            onClick={onClickTranslate}
            opacity="0.75"
            px="2"
          >
            <Icon as={LanguageIcon} color="whiteAlpha.700" />
            <Text color="white" fontSize="xs">
              翻訳する
            </Text>
          </Flex>
        </Flex>
      </Stack>
    </Flex>
  );
};
