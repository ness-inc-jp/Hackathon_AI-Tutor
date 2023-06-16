import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import { NextApiRequest, NextApiResponse } from "next";
import { chatOpenAI } from "@/src/utils/langchain";

const systemMessage1 = new SystemChatMessage(`
#命令書:
あなたは、アメリカ人のプロの英語講師です。
以下の制約条件をもとに、 USERと会話してください。

#制約条件:
・USERは英語初級者である。
・可能であれば、文章の最後は質問で終わらせて会話を引き出してください。
・1つの会話はなるべく50文字以上200文字以内で終わらせてください。
・返信は英語でして下さい。 
`);

const systemMessage2 = new SystemChatMessage(`
#命令書:
あなたは、アメリカ人のプロの英語講師です。
入力される英語の文章を日本語に翻訳して下さい。
`);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { message } = req.body;

  const humanMessage1 = new HumanChatMessage(message);
  const response1 = await chatOpenAI.call([systemMessage1, humanMessage1]);

  const humanMessage2 = new HumanChatMessage(response1.text);
  const response2 = await chatOpenAI.call([systemMessage2, humanMessage2]);

  res.status(200).json({
    en: response1.text,
    ja: response2.text,
  });
}
