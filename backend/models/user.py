from pydantic import BaseModel
from datetime import datetime  # Use Python's datetime module


# User Database Schema
class User(BaseModel):
    id: int
    email: str
    name: str
    password: str
    isAdmin: bool = False
    account_created: datetime  # Use datetime here
    face_data_path: str
    last_login: datetime  # Use datetime here
