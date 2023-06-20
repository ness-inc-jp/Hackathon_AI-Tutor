import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export const chatOpenAI = new ChatOpenAI({
  modelName: "gpt-3.5-turbo-16k",
  openAIApiKey: openAIApiKey,
  streaming: true,
});

export const openaiEmbeddings = new OpenAIEmbeddings({
  openAIApiKey: openAIApiKey,
});
