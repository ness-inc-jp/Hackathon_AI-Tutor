import { Box, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { LanguageIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import { AIChatMessage } from "../types/ChatMessage";
import { useTranslate } from "../utils/useTranslate";

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
            <Box
              cursor="pointer"
              onClick={() => onClickSpeaker(message.audioUrl ? message.audioUrl : "")}
            >
              <Icon as={SpeakerWaveIcon} color="whiteAlpha.700" />
            </Box>
          )}

          <Box cursor="pointer" onClick={onClickTranslate}>
            <Icon as={LanguageIcon} color="whiteAlpha.700" />
          </Box>
        </Flex>
      </Stack>
    </Flex>
  );
};
