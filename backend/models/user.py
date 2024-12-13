from pydantic import BaseModel


# User Database Schema
class User(BaseModel):
    id: int
    email: str
    password: str
    isAdmin: bool = False
