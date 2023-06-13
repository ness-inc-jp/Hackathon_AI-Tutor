from fastapi import FastAPI
from app.core.config import settings
from app.routers import chats

app = FastAPI()

app.include_router(chats.router)


@app.get("/")
async def root():
    print(settings.OPENAI_API_KEY)
    return {"message": "Hello World"}
