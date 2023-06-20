import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  HumanChatMessage,
  LLMResult,
  SystemChatMessage,
} from "langchain/schema";

const systemChatMessage = new SystemChatMessage(`
#命令書:
あなたは、アメリカ人のプロの英語講師です。
以下の制約条件をもとに、最高の添削を出力してください。

#制約条件:
・USERが書いた「#英語日記」の内容を添削する。
・絶対に英語日記の内容がフォーマルか口語的かどうかは気にしない。
・基本的に大きな誤りがない場合は、USERを褒める。
・理由項目は、「日本語」で不適切な理由を必ず詳細に敬語で述べる。
・訂正項目は正しい文章を英語で述べる。
・訂正した箇所は太文字にすること。
・訂正箇所がない場合は「なし」と記す

`);

const chatOpenAI = new ChatOpenAI({
  streaming: true,
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export const useCheckDiary = () => {
  const checkDiary = async (
    diary: string,
    options: {
      handleLLMNewToken?: (token: string) => void;
      handleLLMEnd?: (text: string) => Promise<void>;
    }
  ) => {
    const humanChatMessage = new HumanChatMessage(`
#英語日記
${diary}
    `);

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
    checkDiary,
  };
};
