import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import { chatOpenAI } from "@/src/utils";

const systemChatMessage = new SystemChatMessage(`
#命令書:
あなたは、アメリカ人のプロの英語講師です。
以下の制約条件に従って、出力して下さい。

#制約条件
- 入力される英語の文章から、高校生レベルで必要な単語を抽出して出力して下さい。
- 単語の意味を日本語で答えて下さい。
- 単語と単語の間は、"/"で区切って下さい。

#例
Q: Today, I developed a service to submit to the AI Hackathon. We worked hard as a team to develop it.
A: develop : 開発する / submit : 提出する / hackathon : ハッカソン,

Q:
`);

export const useGetExtractWords = () => {
  const getExtractWords = async (
    text: string,
    options: {
      handleLLMNewToken?: (token: string) => void;
      handleLLMEnd?: (text: string) => Promise<void>;
    },
  ) => {
    const humanChatMessage = new HumanChatMessage(text);

    const response = await chatOpenAI.call([systemChatMessage, humanChatMessage]);

    return response.text;
  };

  return {
    getExtractWords,
  };
};
