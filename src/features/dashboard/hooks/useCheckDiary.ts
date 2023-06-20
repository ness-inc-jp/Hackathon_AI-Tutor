import { PromptTemplate } from "langchain";
import { OutputFixingParser, StructuredOutputParser } from "langchain/output_parsers";
import { HumanChatMessage, LLMResult, SystemChatMessage } from "langchain/schema";
import { chatOpenAI } from "@/src/utils";

const checkedDiarySystemPrompt = new SystemChatMessage(`
#命令書:
あなたは、アメリカ人のプロの英語講師です。
英語で書かれた日記が入力されます。
不適切な表現があった場合のみ、適切な英語に訂正して出力してください。
`);

const systemChatMessage = new SystemChatMessage(`
#命令書:
あなたは、アメリカ人のプロの英語講師です。
英語で書かれたdiaryが入力されます。
以下の制約条件と例をもとに、日本語を主体として日記の添削を出力してください。

#制約条件:
・絶対に英語日記の内容がフォーマルか口語的かどうかは気にしない。
・基本的に大きな誤りがない場合は、日記を褒める。
・理由項目は、「日本語」で不適切な理由を必ず詳細に敬語で述べる。
・訂正項目は正しい文章を英語で述べる。

#例: 
user:Today, AI Hackathon. I applied it. 
AI:【もっと良い書き方】Today, I participated in an AI Hackathon and submitted my application.
【その理由】意味が伝わって良い文章です。しかし、英語としては、"applied"は"応募する"という意味で、"application"は"応募書類"という意味です。そのため、"applied"という単語は、"application"という単語と一緒に使うことができません。そのため、"applied"を"submitted"に変えて、"it"を"my application"に変える必要があります。

user: 
`);

const chatModel = chatOpenAI;

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  new_dairy:
    "If the input diary is not appropriate for English, the English text is corrected to the appropriate form.",
  reason:
    "If the entered diary is inappropriate as English, a Japanese sentence describing the reason",
});

const outputFixingParser = OutputFixingParser.fromLLM(chatModel, parser);

const formatInstructions = parser.getFormatInstructions();

const prompt = new PromptTemplate({
  template:
    "以下の日記が不適切だった場合、適切な英文に直して下さい。また理由も教えて下さい。\n{format_instructions}\n{diary}",
  inputVariables: ["diary"],
  partialVariables: { format_instructions: formatInstructions },
});

export const useCheckDiary = () => {
  const checkDiary = async (
    diary: string,
    options: {
      handleLLMNewToken?: (token: string) => void;
      handleLLMEnd?: (text: string) => Promise<void>;
    },
  ) => {
    // const diaryFormattingChain = new LLMChain({
    //   llm: chatModel,
    //   prompt: prompt,
    //   outputParser: outputFixingParser,
    // });

    // const result = await diaryFormattingChain.call({ diary: diary });
    // console.log(result);

    const humanChatMessage = new HumanChatMessage(diary);

    await chatOpenAI.call([systemChatMessage, humanChatMessage], undefined, [
      {
        handleLLMNewToken(token: string) {
          if (!options.handleLLMNewToken) return;
          options.handleLLMNewToken(token);
        },
        async handleLLMEnd(output: LLMResult) {
          if (!output.generations[0][0].text) return;
          if (!options.handleLLMEnd) return;
          await options.handleLLMEnd(output.generations[0][0].text);
        },
      },
    ]);
  };

  return {
    checkDiary,
  };
};
