from app.core.config import settings
from fastapi import APIRouter
from pydantic import BaseModel
from langchain.chat_models import ChatOpenAI
from langchain import PromptTemplate, LLMChain
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    AIMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.schema import AIMessage, HumanMessage, SystemMessage
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from app.services.parse_chat import parse_chat

chat = ChatOpenAI(temperature=0, openai_api_key=settings.OPENAI_API_KEY)

router = APIRouter(
    prefix="/chats",
    tags=["chats"],
    responses={404: {"description": "Not found"}},
)


class ChatPayload(BaseModel):
    message: str


@router.post("/")
async def create_chat(payload: ChatPayload):
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

    _input = prompt.format_prompt(question=payload.message)
    output = chat(_input.to_messages())
    print(output)
    return output_parser.parse(output)


@router.post("/batch")
async def create_chat_batch():
    batch_messages = [
        [HumanMessage(content="Hello!")],
        [HumanMessage(content="こんにちは!")],
    ]
    response = chat.generate(batch_messages)
    return response
