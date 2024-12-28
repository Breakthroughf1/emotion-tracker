from pydantic import BaseModel


class EmotionRequest(BaseModel):
    emotion: str
    userId: int
