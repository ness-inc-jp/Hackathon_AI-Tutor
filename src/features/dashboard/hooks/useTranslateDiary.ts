import {
  HumanChatMessage,
  LLMResult,
  SystemChatMessage,
} from "langchain/schema";
import { chatOpenAI } from "@/src/utils/langchain";

const systemChatMessage = new SystemChatMessage(`
#命令書:
あなたは、アメリカ人のプロの英語講師です。
入力は日本語の日記です。英語に翻訳して出力して下さい。
`);

export const useTranslateDiary = () => {
  const translateDiary = async (
    diary: string,
    options: {
      handleLLMNewToken?: (token: string) => void;
      handleLLMEnd?: (text: string) => Promise<void>;
    }
  ) => {
    const humanChatMessage = new HumanChatMessage(diary);

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
    translateDiary,
  };
};
