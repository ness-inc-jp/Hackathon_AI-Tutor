import os
from app.core.config import settings

os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY

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


chat = ChatOpenAI(temperature=0)

router = APIRouter(
    prefix="/chats",
    tags=["chats"],
    responses={404: {"description": "Not found"}},
)


class ChatPayload(BaseModel):
    message: str


@router.post("/")
async def create_chat(payload: ChatPayload):
    response = parse_chat(payload.message)
    return response


@router.post("/batch")
async def create_chat_batch():
    batch_messages = [
        [HumanMessage(content="Hello!")],
        [HumanMessage(content="こんにちは!")],
    ]
    response = chat.generate(batch_messages)
    return response
