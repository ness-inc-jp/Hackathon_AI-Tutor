import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { LLMResult } from "langchain/schema";
import { useEffect, useState } from "react";
import { chatOpenAI, useAudio, useUnity } from "@/src/utils";
import { UserChatMessage, AIChatMessage } from "../types/ChatMessage";
import { useTextToSpeech } from "./useTextToSpeech";

const freeModeSystemPrompt = `
#命令書:
あなたは、アメリカ人の女子大学生です。
以下の制約条件をもとに、 USERと会話してください。

#制約条件:
・USERは英語初級者である。
・可能であれば、文章の最後は質問で終わらせて会話を引き出してください。
・身近な話題を中心に会話してください。
・1つの会話はなるべく50文字以上200文字以内で終わらせてください。
・返信は英語でして下さい。 
`;

const freeModePromptTempate = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(freeModeSystemPrompt),
  new MessagesPlaceholder("history"),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
]);

const memory = new BufferMemory({
  returnMessages: true,
  memoryKey: "history",
});

const freeTalkChain = new ConversationChain({
  prompt: freeModePromptTempate,
  memory,
  llm: chatOpenAI,
});

export const useLoveChat = () => {
  const [messages, setMessages] = useState<Array<AIChatMessage | UserChatMessage>>([]);
  const [tempAiMessage, setTempAiMessage] = useState<AIChatMessage | null>(null);

  const { unityContext, talkStart, talkStop } = useUnity();
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (messages.length !== 0) return;

    const firstHumanPrompt = "Hello!";

    setTimeout(() => {
      conversation(firstHumanPrompt, true);
    }, 3000);
  }, []);

  const conversation = async (inputMessage: string, isFirst: boolean) => {
    if (!isFirst) {
      const userChatMessage: UserChatMessage = {
        role: "user",
        content: inputMessage,
      };

      setMessages((prev) => {
        return [...prev, userChatMessage];
      });
    }

    const res = await freeTalkChain.call({ input: inputMessage }, [
      {
        handleLLMNewToken(token: string) {
          setTempAiMessage((prev) => {
            if (!prev) {
              return {
                role: "ai",
                content: token,
              };
            }

            return {
              ...prev,
              content: prev.content + token,
            };
          });
        },
        async handleLLMEnd(output: LLMResult) {
          if (!output.generations[0][0].text) return;

          const text = output.generations[0][0].text;

          const audioUrl = await getAudioUrl(text);

          if (audioUrl) {
            console.log("playAudio");
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
      },
    ]);

    return res;
  };

  return {
    conversation,
    unityContext,
    messages,
    tempAiMessage,
    playAudio,
  };
};
