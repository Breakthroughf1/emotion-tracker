from pydantic import BaseModel
from sqlalchemy import DateTime


# User Database Schema
class User(BaseModel):
    id: int
    email: str
    password: str
    isAdmin: bool = False
    account_created: DateTime
    face_data_path: str
    last_login: DateTime
