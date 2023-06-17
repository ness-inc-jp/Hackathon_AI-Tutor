import { Button, Container, Flex, Heading, Icon, Input, Stack } from "@chakra-ui/react";
import { PaperAirplaneIcon, MicrophoneIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";
import { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { ChatBubble } from "../components/ChatBubble";
import { useAudio } from "../utils/useAudio";
import { useChat } from "../utils/useChat";
import { useCheckMessage } from "../utils/useCheckMessage";
import { useTextToSpeech } from "../utils/useTextToSpeech";

interface BaseMessage {
  content: string;
  type: "user" | "ai";
}

export interface UserMessage extends BaseMessage {
  type: "user";
}

export interface AIMessage extends BaseMessage {
  type: "ai";
  japaneseContent: string;
  audioUrl: string;
}

const TalkPage: NextPage = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Array<UserMessage | AIMessage>>([]);
  const { conversation } = useChat();
  const { checkMessage } = useCheckMessage();
  const { getAudioUrl } = useTextToSpeech();
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const { playAudio } = useAudio();

  const onClickMic = async () => {
    if (!listening) {
      resetTranscript();
      SpeechRecognition.startListening({ language: "en-US", continuous: true });
    } else {
      SpeechRecognition.stopListening();
      await chatConversation(transcript);
    }
  };

  const onClickSend = async () => {
    if (!inputMessage) return;
    chatConversation(inputMessage);
  };

  const chatConversation = async (inputMessage: string) => {
    if (!inputMessage) return;

    // UserMessageの作成&格納
    const userMessage: UserMessage = {
      type: "user",
      content: inputMessage,
    };

    setMessages((prev) => {
      return [...prev, userMessage];
    });

    // GPTの返答を取得
    const { enContent, jaContent } = await conversation(inputMessage);

    const audioContent = await getAudioUrl(enContent);
    if (!audioContent) return;

    const aiMessage: AIMessage = {
      type: "ai",
      content: enContent,
      japaneseContent: jaContent,
      audioUrl: audioContent,
    };

    setMessages((prev) => {
      return [...prev, aiMessage];
    });
  };

  const onClickSpeaker = async (audioUrl: string) => {
    playAudio(audioUrl);
  };

  const onClickCheckMessage = async (messagesIndex: number) => {
    console.log(messagesIndex);
    console.log(messages[messagesIndex]);
    console.log(messages[messagesIndex - 1]);
  };

  return (
    <>
      <Container maxW="container.md">
        <Heading>Talk With AI</Heading>

        <Stack gap="4" pb="76px">
          {messages.map((message, i) => (
            <ChatBubble
              key={i}
              message={message}
              onClickCheckMessage={() => onClickCheckMessage(i)}
              onClickSpeaker={onClickSpeaker}
            />
          ))}
        </Stack>
      </Container>
      <Container bgColor="white" bottom="0" h="76px" maxW="container.md" position="fixed" py="4">
        <Flex gap="2">
          <Input h="44px" onChange={(e) => setInputMessage(e.target.value)} />
          <Button h="44px" onClick={onClickSend} w="44px">
            <Icon as={PaperAirplaneIcon} />
          </Button>
          <Button h="44px" onClick={onClickSend} w="44px">
            <Icon as={MicrophoneIcon} />
          </Button>
        </Flex>
      </Container>
    </>
  );
};

export default TalkPage;
