import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import { NextApiRequest, NextApiResponse } from "next";
import { chatOpenAI } from "@/src/utils/langchain";

const systemMessage = new SystemChatMessage(`
  あなたは英語教師です。
  Userから入力される英文に対して、正しい英語に直して下さい。
`);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { message } = req.body;

  const humanMessage = new HumanChatMessage(message);

  const response = await chatOpenAI.call([systemMessage, humanMessage]);

  res.status(200).json(response);
}
