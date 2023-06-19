import { ChatOpenAI } from "langchain/chat_models/openai";
import { AIChatMessage, HumanChatMessage, LLMResult, SystemChatMessage } from "langchain/schema";

const chatOpenAI = new ChatOpenAI({
  streaming: true,
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const systemChatMessage = new SystemChatMessage(`
# 命令書:
あなたは、アメリカ人のプロの英語講師です。
以下の制約条件をもとに、英会話を添削して下さい。

# 制約条件:
・userは英語初心者です。
・回答は必ず日本語で行なって下さい。
・以下のaiとuserの会話を見て、まずuserの英文を褒めて下さい。
・その後、userの英文が適切じゃなかった場合のみ、その理由を日本語で説明して下さい。
`);

export const useCheckMessage = () => {
  const checkMessage = async (
    aiMessage: string,
    userMessage: string,
    options: {
      handleLLMNewToken?: (token: string) => void;
      handleLLMEnd?: (text: string) => Promise<void>;
    },
  ) => {
    console.log({ aiMessage, userMessage });
    const aiChatMessage = new AIChatMessage(aiMessage);
    const humanChatMessage = new HumanChatMessage(`
    AI Tutor: ${aiMessage}
    User: ${userMessage}
    `);

    await chatOpenAI.call([systemChatMessage, humanChatMessage], undefined, [
      {
        handleLLMNewToken(token: string) {
          if (!options.handleLLMNewToken) return;
          options.handleLLMNewToken(token);
        },
        async handleLLMEnd(output: LLMResult) {
          if (!options.handleLLMEnd) return;
          if (!output.generations[0][0].text) return;
          await options.handleLLMEnd(output.generations[0][0].text);
        },
      },
    ]);
  };

  return { checkMessage };
};
