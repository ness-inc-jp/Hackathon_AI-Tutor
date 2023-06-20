import { Box, Button, Container, Flex, Icon, Text, useDisclosure } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Unity from "react-unity-webgl";
import bg from "@/public/bg-night.jpg";
import { useCheckLove } from "@/src/features/chat/hooks/useCheckLove";
import { useLoveChat } from "@/src/features/chat/hooks/useLoveChat";
import { AiChatBubble } from "../../features/chat/components/AIChatBubbole";
import { ChatInput } from "../../features/chat/components/ChatInput";
import { UserChatBubble } from "../../features/chat/components/UserChatBubble";
const LoveTalkPage: NextPage = () => {
  const router = useRouter();
  const endOfScrollRef = useRef<HTMLDivElement>(null);

  const [inputMessage, setInputMessage] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const { conversation, messages, tempAiMessage, diary, playAudio, unityContext } = useChat();
  const { conversation, messages, tempAiMessage, playAudio, unityContext } = useLoveChat();
  const { lovePoint, checkLove } = useCheckLove();
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (endOfScrollRef.current) {
      endOfScrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, tempAiMessage]);

  const onClickSend = async () => {
    if (inputMessage === "") return;
    setInputMessage("");
    conversation(inputMessage, false);
    checkLove(inputMessage);
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
        <Flex alignItems="center" justifyContent="space-between" position="fixed" top="4">
          <Flex alignItems="center" gap="4">
            <Button bgColor="whiteAlpha.500" borderRadius="full" onClick={() => router.back()}>
              <Icon as={ChevronLeftIcon} />
            </Button>
            <Text color="whiteAlpha.500" fontSize="3xl" fontWeight="semibold">
              Love Talk Mode
            </Text>
          </Flex>

          <Flex alignItems="center" color="pink.400" pl="20">
            <svg
              fill="currentColor"
              style={{ width: "44px", height: "44px" }}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>

            <Text fontSize="4xl" fontWeight="bold">
              {lovePoint}
            </Text>
          </Flex>
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

export default LoveTalkPage;
