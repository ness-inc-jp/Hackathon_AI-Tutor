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
    messages = [
        SystemMessage(
            content="""
        #命令書:
あなたは、アメリカ人のプロの英語講師です。
以下の制約条件をもとに、 USERと会話してください。

#制約条件:
・USERの名前は「」です。
・USERは英語初級者である。
・USERが最初に投稿した3行程度の英語日記の内容をテーマに会話をする。
・文法間違い、より適切な表現があれば訂正し、その理由を述べる。
・可能であれば、文章の最後は質問で終わらせて会話を引き出してください。
・1つの会話はなるべく100文字以上300文字以内で終わらせてください。
        """
        ),
        HumanMessage(content=payload.message),
    ]
    response = chat(messages=messages)
    return response


@router.post("/batch")
async def create_chat_batch():
    batch_messages = [
        [HumanMessage(content="Hello!")],
        [HumanMessage(content="こんにちは!")],
    ]
    response = chat.generate(batch_messages)
    return response
