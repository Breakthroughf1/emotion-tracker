from pydantic import BaseModel
from sqlalchemy import DateTime


# Emotion Database Schema
class Emotion(BaseModel):
    id: int
    user_id: int
    emotion: str
    timestamp: DateTime
