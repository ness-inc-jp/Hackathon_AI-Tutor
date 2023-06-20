import { WebBrowser } from "langchain/tools/webbrowser";
import { NextApiRequest, NextApiResponse } from "next";
import { chatOpenAI, openaiEmbeddings } from "@/src/utils";

const browser = new WebBrowser({ model: chatOpenAI, embeddings: openaiEmbeddings });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = await browser.call(`"https://kids.yahoo.co.jp/today/", "今日は何の日ですか？`);
  res.status(200).send(result);
}
