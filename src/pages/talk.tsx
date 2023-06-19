import { Box, Button, Container, Flex, Icon } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Unity from "react-unity-webgl";
import bg from "@/public/bg-school.jpg";
import { useChat } from "@/src/features/chat/utils/useChat";
import { AiChatBubble } from "../features/chat/components/AIChatBubbole";
import { ChatInput } from "../features/chat/components/ChatInput";
import { UserChatBubble } from "../features/chat/components/UserChatBubble";
import { AIChatMessage, UserChatMessage } from "../features/chat/types/ChatMessage";
import { useTextToSpeech } from "../features/chat/utils/useTextToSpeech";
import { useAudio } from "../utils/useAudio";
import { useUnity } from "../utils/useUnity";

const firstAiMessage: AIChatMessage = {
  role: "ai",
  content: "Hello!, How are you?",
  audioUrl: "",
};

const TalkPage: NextPage = () => {
  const router = useRouter();
  const endOfScrollRef = useRef<HTMLDivElement>(null);
  const { unityContext, talkStart, talkStop } = useUnity();
  const { streamingCoversation } = useChat();
  const { getAudioUrl } = useTextToSpeech();
  const { playAudio } = useAudio({
    onAudioStart: () => {
      console.log("audio start");
      talkStart();
    },
    onAudioEnded: () => {
      console.log("audio ended");
      talkStop();
    },
  });
  const [inputMessage, setInputMessage] = useState("");
  const [tempAiMessage, setTempAiMessage] = useState<AIChatMessage | null>(null);
  const [messages, setMessages] = useState<Array<AIChatMessage | UserChatMessage>>([
    firstAiMessage,
  ]);

  useEffect(() => {
    if (endOfScrollRef.current) {
      endOfScrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, tempAiMessage]);

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
      async handleLLMEnd(text) {
        const audioUrl = await getAudioUrl(text);

        if (audioUrl) {
          playAudio(audioUrl);
        }

        setTempAiMessage(null);

        const aiChatMessage: AIChatMessage = {
          role: "ai",
          content: text,
          audioUrl: audioUrl ? audioUrl : "",
        };

        setMessages((prev) => {
          return [...prev, aiChatMessage];
        });
      },
    });
  };

  const onClickSpeaker = (audioUrl: string) => {
    playAudio(audioUrl);
  };

  const onClickCheckMessage = (messageIndex: number) => {
    const userChatMessage = messages[messageIndex] as UserChatMessage;
    const aiChatMessage = messages[messageIndex - 1] as AIChatMessage;
  };

  return (
    <Box h="100vh" position="absolute" top="0" width="100vw">
      <Container maxW="container.md">
        <Button
          bgColor="whiteAlpha.500"
          borderRadius="full"
          onClick={() => router.push("/home")}
          position="fixed"
          top="4"
        >
          <Icon as={ChevronLeftIcon} />
        </Button>
      </Container>

      <Unity
        style={{
          // position: "absolute",
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
            <>
              {message.role === "ai" && (
                <AiChatBubble
                  key={i}
                  message={message}
                  onClickSpeaker={(audioUrl) => onClickSpeaker(audioUrl)}
                />
              )}
              {message.role === "user" && (
                <UserChatBubble
                  key={i}
                  message={message}
                  prevAiMessageContent={messages[i - 1].content}
                />
              )}
            </>
          ))}
          {tempAiMessage && (
            <AiChatBubble
              message={tempAiMessage}
              onClickSpeaker={(audioUrl) => onClickSpeaker(audioUrl)}
            />
          )}
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
