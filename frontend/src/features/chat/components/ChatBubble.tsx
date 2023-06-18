import { Box, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { LanguageIcon, LightBulbIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import { AIChatMessage, UserChatMessage } from "../types/ChatMessage";

interface Props {
  message: UserChatMessage | AIChatMessage;
}

export const ChatBubble: FC<Props> = (props) => {
  const { message } = props;

  if (message.role === "user") {
    return <UserChatBubble message={message} />;
  } else if (message.role === "ai") {
    return <AiChatBubble message={message} />;
  }
};

const UserChatBubble: FC<{ message: UserChatMessage }> = ({ message }) => {
  const onClickCheckContent = () => {};

  return (
    <Flex justifyContent="flex-end">
      <Flex alignItems="flex-end" flexDirection="column" gap="1">
        <Box
          bgColor="gray.100"
          borderRadius="18"
          borderTopRightRadius="0"
          color="gray.800"
          px="4"
          py="3"
        >
          <Text>{message.content}</Text>
        </Box>
        <Box onClick={onClickCheckContent} pr="2">
          <Icon as={LightBulbIcon} color="whiteAlpha.700" />
        </Box>
        {message.checkContent && (
          <Box
            bgColor="gray.50"
            borderRadius="18"
            borderTopRightRadius="0"
            color="gray.500"
            maxW="80%"
            px="4"
            py="3"
          >
            <Text color="gray.600">{message.checkContent}</Text>
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

const AiChatBubble: FC<{ message: AIChatMessage }> = ({ message }) => {
  const [isShowJapanese, setIsShowJapanese] = useState<boolean>(false);
  const onClickSpeaker = (audioUrl: string) => {};

  return (
    <Flex justifyContent="flex-start">
      <Stack gap="1">
        <Box
          bgColor="messenger.500"
          borderRadius="18"
          borderTopLeftRadius="0"
          color="white"
          px="4"
          py="3"
        >
          <Text>{message.content}</Text>
        </Box>

        <Flex gap="2" pl="2">
          {message.audioUrl && (
            <Box onClick={() => onClickSpeaker(message.audioUrl)}>
              <Icon as={SpeakerWaveIcon} />
            </Box>
          )}
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
        {isShowJapanese && (
          <Box
            bgColor="messenger.50"
            borderRadius="18"
            borderTopLeftRadius="0"
            color="messenger.800"
            px="4"
            py="3"
          >
            <Text>{message.japaneseContent}</Text>
          </Box>
        )}
      </Stack>
    </Flex>
  );
};
