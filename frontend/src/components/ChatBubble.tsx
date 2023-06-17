import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { LanguageIcon, SpeakerWaveIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import { AIMessage, UserMessage } from "../pages/talk";

interface Props {
  message: AIMessage | UserMessage;
  onClickSpeaker: (audioUrl: string) => void;
  onClickCheckMessage: () => void;
}

export const ChatBubble: FC<Props> = (props) => {
  const { message, onClickSpeaker, onClickCheckMessage } = props;
  const [isShowJapanese, setIsShowJapanese] = useState(false);

  return (
    <Flex justifyContent={message.type === "user" ? "flex-end" : "flex-start"}>
      <Box
        bgColor={message.type === "user" ? "blue.100" : "green.100"}
        borderRadius="16"
        px="3"
        py="2"
      >
        <Text>{message.content}</Text>
        {message.type === "user" && (
          <Box onClick={onClickCheckMessage} pt="2">
            <Icon as={LightBulbIcon} />
          </Box>
        )}
        {message.type === "ai" && (
          <>
            <Flex gap="2" pt="2">
              <Box onClick={() => onClickSpeaker(message.audioUrl)}>
                <Icon as={SpeakerWaveIcon} />
              </Box>
              <Box
                onClick={() =>
                  setIsShowJapanese((prev) => {
                    return !prev;
                  })
                }
              >
                <Icon as={LanguageIcon} />
              </Box>
            </Flex>
            {isShowJapanese && <Text color="blackAlpha.700">{message.japaneseContent}</Text>}
          </>
        )}
      </Box>
    </Flex>
  );
};
