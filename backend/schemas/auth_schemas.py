from pydantic import BaseModel, EmailStr
from typing import Optional


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    isAdmin: Optional[bool] = False


class FaceDataRequest(BaseModel):
    email: EmailStr
    face_data: str


class TokenResponse(BaseModel):
    token: str


class ForgotPasswordRequest(BaseModel):
    email: str
