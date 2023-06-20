import { Box, Button, Container, Flex, Icon, Portal, Text, useDisclosure } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Unity from "react-unity-webgl";
import bg from "@/public/bg-school.jpg";
import { useChat } from "@/src/features/chat/hooks/useChat";
import { AiChatBubble } from "../features/chat/components/AIChatBubbole";
import { ChatInput } from "../features/chat/components/ChatInput";
import { DiaryModal } from "../features/chat/components/DiaryModal";
import { UserChatBubble } from "../features/chat/components/UserChatBubble";

const TalkPage: NextPage = () => {
  const router = useRouter();
  const endOfScrollRef = useRef<HTMLDivElement>(null);

  const [inputMessage, setInputMessage] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { conversation, messages, tempAiMessage, diary, playAudio, unityContext } = useChat();
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (endOfScrollRef.current) {
      endOfScrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, tempAiMessage]);

  const onClickSend = async () => {
    if (inputMessage === "") return;
    setInputMessage("");
    conversation(inputMessage, false);
  };

  const onClickMic = async () => {
    if (!listening) {
      resetTranscript();
      SpeechRecognition.startListening({ language: "ja-JP" });
    } else {
      console.log(transcript);
      SpeechRecognition.stopListening();
      conversation(transcript, false);
    }
  };

  const onClickSpeaker = (audioUrl: string) => {
    playAudio(audioUrl);
  };

  return (
    <Box h="100vh" position="absolute" top="0" width="100vw">
      <Container maxW="container.md">
        <Flex alignItems="center" gap="4" position="fixed" top="4">
          <Button bgColor="whiteAlpha.500" borderRadius="full" onClick={() => router.back()}>
            <Icon as={ChevronLeftIcon} />
          </Button>
          <Text color="blackAlpha.700" fontSize="3xl" fontWeight="semibold">
            {diary ? "Diary Talk Mode" : "Free Talk Mode"}
          </Text>
          {diary && (
            <>
              <Button backgroundColor="blackAlpha.400" borderRadius="4" onClick={onOpen}>
                📖
              </Button>
              <Portal>
                <DiaryModal diary={diary} isOpen={isOpen} onClose={onClose} />
              </Portal>
            </>
          )}
        </Flex>
      </Container>

      <Unity
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: `url(${bg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        unityContext={unityContext}
      />

      <Container bottom="0" insetX={0} maxW="container.md" mx="auto" position="fixed" py="4">
        <Flex flexDirection="column" gap="1" maxH="300px" overflow="scroll" pb="4">
          {messages.map((message, i) => (
            <Box key={i}>
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
                  prevAiMessageContent={messages[i - 1] ? messages[i - 1].content : ""}
                />
              )}
            </Box>
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
            value: inputMessage,
            onChange: (e) => setInputMessage(e.target.value),
          }}
          isListening={listening}
          micButtonProps={{
            onClick: onClickMic,
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
