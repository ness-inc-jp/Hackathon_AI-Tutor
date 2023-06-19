import { ChatOpenAI } from "langchain/chat_models/openai";

export const chatOpenAI = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  streaming: true,
});
