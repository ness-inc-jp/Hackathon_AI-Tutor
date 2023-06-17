from fastapi import APIRouter
from pydantic import BaseModel
from langchain.chat_models import ChatOpenAI
from langchain.prompts.chat import HumanMessagePromptTemplate

import os
from app.core.config import settings

os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY

router = APIRouter(
    prefix="/gpts",
    tags=["gpts"],
    responses={404: {"description": "Not found"}},
)


class CheckUserMessagePayload(BaseModel):
    ai_message: str
    user_message: str


# @router.post("/")
# async def check_user_message(payload: CheckUserMessagePayload):
