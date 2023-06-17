import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import { NextApiRequest, NextApiResponse } from "next";
import { chatOpenAI } from "@/src/utils/langchain";

const systemMessagePrompt = `
#命令書:
あなたは、アメリカ人のプロの英語講師です。
以下の"AI Tutor"と"User"のやり取りを見て、"User"の英語が不適切だと考えた場合はその理由を日本語で説明して下さい。
また、正しいと思う英文を英語で出力して下さい。
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { aiMessage, userMessage } = req.body;

  const humanMessagePrompt = `AI Tutor: ${aiMessage}\nUser: ${userMessage}\n`;

  const response = await chatOpenAI.call([
    new SystemChatMessage(systemMessagePrompt),
    new HumanChatMessage(humanMessagePrompt),
  ]);

  const responseMessage = response.text;

  res.status(200).send(responseMessage);
}
