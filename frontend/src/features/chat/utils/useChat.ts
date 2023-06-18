import axios, { AxiosRequestConfig } from "axios";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, LLMResult, SystemChatMessage } from "langchain/schema";
import { useState } from "react";
import { toast } from "react-hot-toast";

const systemMessage = new SystemChatMessage(`
#命令書:
あなたは、アメリカ人のプロの英語講師です。
以下の制約条件をもとに、 USERと会話してください。

#制約条件:
・USERは英語初級者である。
・可能であれば、文章の最後は質問で終わらせて会話を引き出してください。
・1つの会話はなるべく50文字以上200文字以内で終わらせてください。
・返信は英語でして下さい。 
`);

export const useChat = () => {
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  const conversation = async (
    inputMessage: string,
  ): Promise<{ enContent: string; jaContent: string }> => {
    setIsChatLoading(true);

    const requestConfig: AxiosRequestConfig = {
      url: "/api/gpt/chat",
      method: "post",
      data: {
        message: inputMessage,
      },
    };

    let enContent = "";
    let jaContent = "";

    try {
      // GPTの返答を取得
      const response = await axios(requestConfig);
      enContent = response.data.en;
      jaContent = response.data.ja;
    } catch (err) {
      console.log(err);
      toast.error("エラーが発生しました");
    } finally {
      setIsChatLoading(false);
    }

    return {
      enContent,
      jaContent,
    };
  };

  const streamingCoversation = async (
    inputMessage: string,
    options: {
      handleLLMNewToken: (token: string) => void;
      handleLLMEnd: (text: string) => void;
    },
  ) => {
    const chat = new ChatOpenAI({
      streaming: true,
      openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    const humanMessage = new HumanChatMessage(inputMessage);

    const response = await chat.call([systemMessage, humanMessage], undefined, [
      {
        handleLLMNewToken(token: string) {
          options.handleLLMNewToken(token);
        },
        handleLLMEnd(output: LLMResult) {
          if (!output.generations[0][0].text) return;
          options.handleLLMEnd(output.generations[0][0].text);
        },
      },
    ]);

    return response.text;
  };

  return {
    isChatLoading,
    conversation,
    streamingCoversation,
  };
};
