import { ConversationChain } from "langchain/chains";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { chatOpenAI } from "@/src/utils";

const loveCheckSystemPrompt = `
あなたはアメリカの女子大生です。
USERと恋愛シミュレーションゲームを行います。
以下の制約条件をもとに、入力メッセージに点数を付けてください。

#制約条件
・数字以外の出力は絶対にせず、点数のみ付ける。
・点数は-10から10で評価する。
・採点理由はいらない。点数のみ付ける。
・アメリカの女子大生になりきって、趣味や好みの話題やジョークは加点し、誹謗中傷は減点する。
・ロマンチックな言葉も加点する。
・英文として適切ではない言葉は減点する。

#採点フォーマット
5
`;

const loveCheckPromptTempate = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(loveCheckSystemPrompt),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
]);

const loveCheckChain = new ConversationChain({
  prompt: loveCheckPromptTempate,
  llm: chatOpenAI,
});

export const useCheckLove = () => {
  const [lovePoint, setLovePoint] = useState<number>(0);

  const checkLove = async (input: string) => {
    // LovePointがNaNの場合は0にする
    if (Number.isNaN(lovePoint)) {
      setLovePoint(0);
    }

    // LovePointの取得
    loveCheckChain.call({ input: input }, [
      {
        handleLLMEnd(output) {
          if (!output.generations[0][0].text) {
            setLovePoint((prev) => {
              return prev + newLovePoint;
            });
            return;
          }

          const response = output.generations[0][0].text;
          console.log("newLovePoint", response);

          let newLovePoint = 0;

          try {
            newLovePoint = Number(response);
          } catch (error) {
            console.log(error);
          }

          toast.success(`${newLovePoint} Point`);
          setLovePoint((prev) => {
            return prev + newLovePoint;
          });
        },
      },
    ]);
  };

  return {
    lovePoint,
    checkLove,
  };
};
