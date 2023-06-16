from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)
from langchain.chat_models import ChatOpenAI
from app.core.config import settings

chat_model = ChatOpenAI(openai_api_key=settings.OPENAI_API_KEY)

response_schemas = [
    ResponseSchema(name="en", description="English responses to users"),
    ResponseSchema(
        name="ja",
        description="Text translated into Japanese from English responses to users",
    ),
]

output_parser = StructuredOutputParser(response_schemas=response_schemas)

format_instructions = output_parser.get_format_instructions()

system_message = SystemMessagePromptTemplate(
    """
    #命令書:
あなたは、アメリカ人のプロの英語講師です。
以下の制約条件をもとに、 USERと会話してください。

#制約条件:
・USERは英語初級者である。
・可能であれば、文章の最後は質問で終わらせて会話を引き出してください。
・1つの会話はなるべく50文字以上200文字以内で終わらせてください。
・返信は英語と日本語の両方を出力して下さい。

{format_instructions}
"""
)

human_message = HumanMessagePromptTemplate("{message}")

prompt = ChatPromptTemplate(
    messages=[
        system_message,
        human_message,
    ],
    input_variables=["message"],
    partial_variables={"format_instructions": format_instructions},
)


def parse_chat(message):
    _input = prompt.format_prompt(message=message)
    output = chat_model(_input.to_messages())

    return output_parser.parse(output)
