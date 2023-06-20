import { Flex, Box, Text, Icon } from "@chakra-ui/react";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import { useCheckMessage } from "../hooks/useCheckMessage";
import { UserChatMessage } from "../types/ChatMessage";

interface Props {
  prevAiMessageContent: string;
  message: UserChatMessage;
}

export const UserChatBubble: FC<Props> = (props) => {
  const { message, prevAiMessageContent } = props;
  const { checkMessage } = useCheckMessage();
  const [checkContent, setCheckContent] = useState<string>("");
  const [isShowCheckContent, setIsShowCheckContent] = useState<boolean>(false);

  const onClickCheckContent = async () => {
    setCheckContent("");
    setIsShowCheckContent(true);

    await checkMessage(prevAiMessageContent, message.content, {
      handleLLMNewToken(token) {
        setCheckContent((prev) => {
          return prev + token;
        });
      },
    });
  };

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

        {prevAiMessageContent && (
          <Flex
            alignItems="center"
            bgColor="gray.100"
            borderRadius="full"
            color="gray.800"
            cursor="pointer"
            gap="1"
            onClick={onClickCheckContent}
            opacity={checkContent ? "0.4" : "0.6"}
            px="2"
          >
            <Icon as={LightBulbIcon} />
            <Text fontSize="xs">添削する</Text>
          </Flex>
        )}

        {checkContent && (
          <Box
            bgColor="gray.50"
            borderRadius="18"
            borderTopRightRadius="0"
            color="gray.500"
            maxW="80%"
            mb="2"
            px="4"
            py="3"
          >
            <Text pb="1">もっと良くなるかも💡</Text>
            <Text color="gray.600">{checkContent}</Text>
          </Box>
        )}
      </Flex>
    </Flex>
  );
};
