import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, LLMResult, SystemChatMessage } from "langchain/schema";

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

const chatOpenAI = new ChatOpenAI({
  streaming: true,
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export const useChat = () => {
  const streamingCoversation = async (
    inputMessage: string,
    options: {
      handleLLMNewToken: (token: string) => void;
      handleLLMEnd: (text: string) => Promise<void>;
    },
  ) => {
    const humanMessage = new HumanChatMessage(inputMessage);

    await chatOpenAI.call([systemMessage, humanMessage], undefined, [
      {
        handleLLMNewToken(token: string) {
          options.handleLLMNewToken(token);
        },
        async handleLLMEnd(output: LLMResult) {
          if (!output.generations[0][0].text) return;
          await options.handleLLMEnd(output.generations[0][0].text);
        },
      },
    ]);
  };

  return {
    streamingCoversation,
  };
};
