from fastapi import APIRouter, HTTPException, Query
from sqlalchemy.exc import SQLAlchemyError
from config import database
from schemas.user_schemas import EmotionRequest

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
        SELECT id, emotion, timestamp FROM emotions WHERE user_id = :user_id
    """
    try:
        rows = await database.fetch_all(query, {"user_id": user_id})
        return {"emotion": rows}

    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error occurred") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch emotion: {str(e)}")
