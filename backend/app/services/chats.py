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
    ResponseSchema(name="english_answer", description="Answer in English"),
    ResponseSchema(name="japanese_answer", description="Answer in Japanese"),
]
output_parser = StructuredOutputParser.from_response_schemas(response_schemas)

format_instructions = output_parser.get_format_instructions()
prompt = ChatPromptTemplate(
    messages=[
        HumanMessagePromptTemplate.from_template(
            "answer the users question in both English and Japanese.\n{format_instructions}\n{question}"
        )
    ],
    input_variables=["question"],
    partial_variables={"format_instructions": format_instructions},
)


def parse_chat(message):
    _input = prompt.format_prompt(question=message)
    output = chat_model(_input.to_messages())

    return output_parser.parse(output)
