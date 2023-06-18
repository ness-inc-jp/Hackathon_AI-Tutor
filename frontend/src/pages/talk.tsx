import { Box, Container, Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Unity from "react-unity-webgl";
import { ChatBubble } from "../features/chat/components/ChatBubble";
import { ChatInput } from "../features/chat/components/ChatInput";
import { AIChatMessage, UserChatMessage } from "../features/chat/types/ChatMessage";
import { useUnity } from "../utils/useUnity";
import bg from "@/public/bg-school.jpg";
import { useChat } from "@/src/features/chat/utils/useChat";

const firstAiMessage: AIChatMessage = {
  role: "ai",
  content: "Hello!, How are you?",
  japaneseContent: "こんにちは、元気ですか？",
  audioUrl: "",
};

const TalkPage: NextPage = () => {
  const endOfScrollRef = useRef<HTMLDivElement>(null);
  const { unityContext } = useUnity();
  const { streamingCoversation } = useChat();
  const [inputMessage, setInputMessage] = useState("");
  const [tempAiMessage, setTempAiMessage] = useState<AIChatMessage | null>(null);
  const [messages, setMessages] = useState<Array<AIChatMessage | UserChatMessage>>([
    firstAiMessage,
  ]);

  useEffect(() => {
    if (endOfScrollRef.current) {
      endOfScrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const onClickSend = async () => {
    const userChatMessage: UserChatMessage = {
      role: "user",
      content: inputMessage,
    };

    setMessages((prev) => {
      return [...prev, userChatMessage];
    });

    await streamingCoversation(inputMessage, {
      handleLLMNewToken(token) {
        console.log("handleLLMNewToken", token);

        setTempAiMessage((prev) => {
          if (!prev) {
            return {
              role: "ai",
              content: token,
              japaneseContent: "",
              audioUrl: "",
            };
          }

          return {
            ...prev,
            content: prev.content + token,
          };
        });
      },
      handleLLMEnd(text) {
        const aiChatMessage: AIChatMessage = {
          role: "ai",
          content: text,
          japaneseContent: text,
          audioUrl: "",
        };

        setTempAiMessage(null);

        setMessages((prev) => {
          return [...prev, aiChatMessage];
        });
      },
    });
  };

  return (
    <Box h="100vh" position="absolute" top="0" width="100vw">
      <Unity
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `url(${bg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        unityContext={unityContext}
      />

      <Container bottom="0" insetX={0} maxW="container.md" mx="auto" position="fixed" py="4">
        <Flex flexDirection="column" maxH="300px" overflow="scroll" pb="4">
          {messages.map((message, i) => (
            <ChatBubble key={i} message={message} />
          ))}
          {tempAiMessage && <ChatBubble message={tempAiMessage} />}
          <div ref={endOfScrollRef} />
        </Flex>
        <ChatInput
          inputProps={{
            onChange: (e) => setInputMessage(e.target.value),
          }}
          micButtonProps={{
            onClick: onClickSend,
          }}
          sendButtonProps={{
            isDisabled: inputMessage === "",
            onClick: onClickSend,
          }}
        />
      </Container>
    </Box>
  );
};

export default TalkPage;
