from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=5, max_length=3000)


class Citation(BaseModel):
    article: str
    title: str
    excerpt: str
