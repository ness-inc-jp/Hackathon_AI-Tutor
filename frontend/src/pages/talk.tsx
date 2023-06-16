import { Box, Button, Container, Flex, Heading, Icon, Input, Stack, Text } from "@chakra-ui/react";
import {
  PaperAirplaneIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  LanguageIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { NextPage } from "next";
import { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useAudio } from "../utils/useAudio";
import { useTextToSpeech } from "../utils/useTextToSpeech";

interface BaseMessage {
  content: string;
  type: "user" | "ai";
}

interface UserMessage extends BaseMessage {
  type: "user";
}

interface AIMessage extends BaseMessage {
  type: "ai";
  japaneseContent: string;
  audioUrl: string;
}

const TalkPage: NextPage = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Array<UserMessage | AIMessage>>([]);
  const [showJapanese, setShowJapanese] = useState(false);
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
    const response = await axios.post("/api/gpt/chat", {
      message: inputMessage,
    });

    if (response.status !== 200) {
      console.log(response);
      alert("エラーが発生しました");
      return;
    }

    console.log(response);

    if (response.data === "") {
      alert("エラーが発生しました");
      return;
    }

    const englishContent = response.data.en;
    const japaneseContent = response.data.ja;

    const audioContent = await getAudioUrl(englishContent);
    if (!audioContent) return;

    const aiMessage: AIMessage = {
      type: "ai",
      content: englishContent,
      japaneseContent: japaneseContent,
      audioUrl: audioContent,
    };

    setMessages((prev) => {
      return [...prev, aiMessage];
    });
  };

  const onClickSpeaker = async (audioUrl: string) => {
    playAudio(audioUrl);
  };

  console.log(messages);

  return (
    <>
      <Container maxW="container.md">
        <Heading>Talk With AI</Heading>

        <Stack gap="4" pb="76px">
          {messages.map((message, i) => (
            <Flex justifyContent={message.type === "user" ? "flex-end" : "flex-start"} key={i}>
              <Box
                bgColor={message.type === "user" ? "blue.100" : "green.100"}
                borderRadius="16"
                px="3"
                py="2"
              >
                <Text>{message.content}</Text>
                {message.type === "ai" && (
                  <>
                    <Flex gap="2" pt="2">
                      <Box onClick={() => onClickSpeaker(message.audioUrl)}>
                        <Icon as={SpeakerWaveIcon} />
                      </Box>
                      <Box
                        onClick={() =>
                          setShowJapanese((prev) => {
                            return !prev;
                          })
                        }
                      >
                        <Icon as={LanguageIcon} />
                      </Box>
                    </Flex>
                    {showJapanese && <Text color="blackAlpha.700">{message.japaneseContent}</Text>}
                  </>
                )}
              </Box>
            </Flex>
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
