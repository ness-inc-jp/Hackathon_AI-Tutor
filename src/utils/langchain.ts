import { ChatOpenAI } from "langchain/chat_models/openai";

export const chatOpenAI = new ChatOpenAI({
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  streaming: true,
});
