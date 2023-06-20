import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, LLMResult, SystemChatMessage } from "langchain/schema";

const chatOpenAI = new ChatOpenAI({
  streaming: true,
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const systemChatMessage = new SystemChatMessage(`

#命令書:
あなたは、日本人で女性のプロの英語講師です。
以下の制約条件をもとに、英語を流暢な日本語に翻訳して下さい。

#制約条件:
・USERは英語初級者である。
・絶対に与えられた英文以上の翻訳はしないで下さい。
・返信は日本語でして下さい。 
`);

export const useTranslate = () => {
  const translate = async (
    inputEnglish: string,
    options: {
      handleLLMNewToken?: (token: string) => void;
      handleLLMEnd?: (text: string) => Promise<void>;
    },
  ) => {
    const humanChatMessage = new HumanChatMessage(inputEnglish);

    await chatOpenAI.call([systemChatMessage, humanChatMessage], undefined, [
      {
        handleLLMNewToken(token: string) {
          if (!options.handleLLMNewToken) return;
          options.handleLLMNewToken(token);
        },
        async handleLLMEnd(output: LLMResult) {
          if (!output.generations[0][0].text) return;
          if (!options.handleLLMEnd) return;
          await options.handleLLMEnd(output.generations[0][0].text);
        },
      },
    ]);
  };

  return {
    translate,
  };
};
