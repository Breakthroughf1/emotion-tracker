import os
from typing import Optional

from fastapi import APIRouter, Form, HTTPException, Query, Header, UploadFile, File
from pydantic import EmailStr
from sqlalchemy.exc import SQLAlchemyError
from starlette.responses import JSONResponse, FileResponse

from config import database
from schemas.user_schemas import EmotionRequest, UpdateProfileResponse

from utils.jwt_handler import decode_jwt

user_router = APIRouter()


@user_router.post("/add_emotion")
async def add_emotion(useremotion: EmotionRequest):
    """
    API to add a user's emotion data to the database.
    """
    print(useremotion.userId, useremotion.emotion)

    query = """
        INSERT INTO emotions (user_id, emotion)
        VALUES (:user_id, :emotion)
    """
    try:
        await database.execute(query, {"user_id": useremotion.userId, "emotion": useremotion.emotion})
        return {"message": "Emotion data added successfully"}

    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error occurred") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add emotion: {str(e)}")


@user_router.get("/get_emotion")
async def get_emotion(user_id: str = Query(..., description="The ID of the user to fetch emotion data for")):
    """
    API to get a user's emotion data from the database.
    """

    query = """
        SELECT ROW_NUMBER() OVER (ORDER BY timestamp ASC) AS id, emotion, timestamp FROM emotions WHERE user_id = :user_id
    """
    try:
        rows = await database.fetch_all(query, {"user_id": user_id})
        return {"emotion": rows}

    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error occurred") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch emotion: {str(e)}")


@user_router.get("/get_emotion_stats")
async def get_emotion_stats(
        user_id: str = Query(None, description="The ID of the user to fetch aggregated emotion data for"),
):
    """
    API to get aggregated emotion statistics from the database within a date range.
    """
    query = """
            SELECT emotion, COUNT(*) AS count
            FROM emotions
            WHERE user_id = :user_id
            GROUP BY emotion
            ORDER BY count DESC
        """
    try:
        rows = await database.fetch_all(query, {"user_id": user_id})

        # Adding sentiment analysis if applicable
        emotions = {row['emotion']: row['count'] for row in rows}

        # Calculate most frequent emotion (for example: dominant emotion)
        dominant_emotion = max(emotions, key=emotions.get, default=None)

        # Calculate mood balance (positive vs negative emotions, if applicable)
        positive_emotions = ['happy', 'joyful', 'excited']  # Example positive emotions
        negative_emotions = ['sad', 'angry', 'anxious']  # Example negative emotions

        positive_count = sum(emotions.get(emotion, 0) for emotion in positive_emotions)
        negative_count = sum(emotions.get(emotion, 0) for emotion in negative_emotions)

        mood_balance = "Neutral"
        if positive_count > negative_count:
            mood_balance = "Positive"
        elif negative_count > positive_count:
            mood_balance = "Negative"

        return {
            "emotion_stats": rows,
            "dominant_emotion": dominant_emotion,
            "mood_balance": mood_balance,
            "positive_count": positive_count,
            "negative_count": negative_count
        }
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error occurred") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch emotion stats: {str(e)}")


@user_router.get("/get_user_details")
async def get_user_details(authorization: str = Header(..., description="Authorization token")):
    """
    API to get user details from the database.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

        # Extract token from header
    token = authorization.split(" ")[1]

    # Decode token to get email
    user = decode_jwt(token)

    # Query to fetch user details by email
    query = """
            SELECT id, name, email, face_data_path
            FROM users
            WHERE email = :email
        """
    try:
        result = await database.fetch_one(query, {"email": user.get("sub")})
        if not result:
            raise HTTPException(status_code=404, detail="User not found")

        user = dict(result)
        file_path = user["face_data_path"]
        public_url = f"http://127.0.0.1:8000/static/{file_path}"
        user["face_data_path"] = public_url
        return {"user_details": user}

    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error occurred") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch user details: {str(e)}")

@user_router.post("/update_profile", response_model=UpdateProfileResponse)
async def update_profile(
    name: str = Form(...),
    email: str = Form(...),
    profilePic: Optional[UploadFile] = File(None),
    authorization: str = Header(..., description="Authorization token")
):
    """
    API to update user profile details (name, email, profile picture).
    :return: Updated user details
    """

    # Check if the authorization header contains Bearer token
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    # Extract token from the authorization header
    token = authorization.split(" ")[1]

    # Decode JWT token to extract user information (e.g., email)
    user_data = decode_jwt(token)
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid token")

    try:
        # Update name and email in the database if provided
        if name or email:
            update_query = """
                UPDATE users
                SET name = COALESCE(:name, name),
                    email = COALESCE(:email, email)
                WHERE id = :user_id
            """
            try:
                await database.execute(update_query, {"name": name, "email": email, "user_id": user_data["id"]})
            except Exception as e:
                print(f"Database update failed: {e}")
                raise HTTPException(status_code=500, detail="Database update failed")
        if profilePic:
            face_dir = "face_data/"
            os.makedirs(face_dir, exist_ok=True)
            file_name = email.split('@')[0]  # Use email as part of filename
    
            face_path = os.path.join(face_dir, f"{file_name}.png")
    
            # Decode and save the base64 image
            with open(face_path, "wb") as image_file:
                image_file.write(await profilePic.read())
    
            # Update the face data path in the database
            update_query_face = """
                UPDATE users
                SET face_data_path = :face_path
                WHERE email = :email
            """
            await database.execute(update_query_face, {"face_path": face_path, "email": email})

        return JSONResponse(
            status_code=200,
            content={
                "message": "Profile updated successfully"
            },
        )

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

@user_router.delete("/delete")
async def delete_account(email: EmailStr):
    """
    Deletes a user account based on the provided email.

    Args:
        email (str): The email address of the user to be deleted.

    Returns:
        dict: A message confirming the deletion or an error message.
    """
    # Check if the user exists
    query = "SELECT * FROM users WHERE email = :email"
    user = await database.fetch_one(query=query, values={"email": email})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Delete the user
    delete_query = "DELETE FROM users WHERE email = :email"
    await database.execute(query=delete_query, values={"email": email})

    return {"message": f"Account associated with {email} has been deleted successfully."}