from datetime import datetime

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from schemas.auth_schemas import RegisterRequest, FaceDataRequest, TokenResponse, LoginRequest
from utils.jwt_handler import create_jwt
import os
import base64
from config import database, settings
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
auth_router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = settings.SECRET_KEY


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token",
            )
        return email
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )


# User Registration (Save user details to the database)
@auth_router.post("/register")
async def register(user_data: RegisterRequest):
    hashed_password = pwd_context.hash(user_data.password)
    user_data.password = hashed_password  # password hashed version

    query = """
        INSERT INTO users (email, password, isAdmin)
        VALUES (:email, :password, :isAdmin)
    """
    try:
        await database.execute(query, user_data.dict())
        return {"message": "User registered successfully"}
    except Exception as e:
        if "1062" in str(e):  # MySQL error code 1062 indicates a duplicate entry
            raise HTTPException(status_code=400, detail="Email already registered")
        else:
            print(f"Error occurred: {e}")  # For debugging
            raise HTTPException(status_code=500, detail="Internal Server Error")


@auth_router.post("/register/face-data", response_model=TokenResponse)
async def register_face_data(face_data: FaceDataRequest):
    email = face_data.email
    face_data_encoded = face_data.face_data

    face_dir = "face_data/"
    os.makedirs(face_dir, exist_ok=True)
    file_name = email.split('@')[0]  # Adjust to handle email properly

    face_path = os.path.join(face_dir, f"{file_name}.png")

    try:
        # Decode and save the base64 image
        with open(face_path, "wb") as image_file:
            image_file.write(base64.b64decode(face_data_encoded))

        # Update user with face data path
        update_query = """
            UPDATE users SET face_data_path = :face_path WHERE email = :email
        """
        await database.execute(update_query, {"face_path": face_path, "email": email})

        # Fetch user details
        query = "SELECT id, email, isAdmin FROM users WHERE email = :email"
        user = await database.fetch_one(query, {"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Generate JWT token
        payload = {
            "sub": user["email"],
            "role": bool(user["isAdmin"]),
            "id": user["id"],
            "iat": datetime.utcnow(),
        }
        token = create_jwt(payload)

        return {"token": token}

    except Exception as e:
        # Enhanced error logging
        print(f"Error occurred: {repr(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@auth_router.post("/login", response_model=TokenResponse)
async def login(user_data: LoginRequest):
    email = user_data.email
    password = user_data.password

    # Fetch user details
    query = "SELECT id, email, isAdmin, password FROM users WHERE email = :email"
    user = await database.fetch_one(query, {"email": email})

    if not user or not pwd_context.verify(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Update last login
    update_query = "UPDATE users SET last_login = :date WHERE email = :email"
    await database.execute(update_query, {"date": datetime.utcnow().isoformat(), "email": email})

    # Generate JWT token with additional claims
    payload = {"sub": user["email"], "role": bool(user["isAdmin"]), "id": user["id"], "iat": datetime.utcnow()}
    token = create_jwt(payload)

    return {"token": token}


@auth_router.get("/users/me")
async def get_user_details(email: str = Depends(get_current_user)):
    query = "SELECT id, email, isAdmin, account_created, face_data_path, last_login FROM users WHERE email = :email"
    user = await database.fetch_one(query, {"email": email})
    print(user)
    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    return user
