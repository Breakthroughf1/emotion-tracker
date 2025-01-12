from fastapi import APIRouter, HTTPException, Header,Query
from sqlalchemy.exc import SQLAlchemyError
from config import database
from utils.jwt_handler import decode_jwt

admin_router = APIRouter()


@admin_router.get("/get_all_emotion")
async def get_emotion(authorization: str = Header(...)):
    """
    API to get all user emotion data from the database, grouped by user_id.
    """
    try:
        # Extract and validate the token
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid token format")
        token = authorization.split(" ")[1]
        user = decode_jwt(token)
        if not user.get("role") or not user["role"]:
            raise HTTPException(status_code=403, detail="Access forbidden: Admins only")

        # Fetch data from the database
        query = """
            SELECT 
                emotions.user_id, 
                users.email, 
                emotions.emotion, 
                emotions.timestamp 
            FROM emotions
            JOIN users ON emotions.user_id = users.id
            ORDER BY emotions.user_id, emotions.timestamp
        """
        rows = await database.fetch_all(query)

        # Group data by user_id
        grouped_data = {}
        for row in rows:
            user_id = row["user_id"]
            if user_id not in grouped_data:
                grouped_data[user_id] = {
                    "user_id": user_id,
                    "email": row["email"],
                    "emotions": []
                }
            grouped_data[user_id]["emotions"].append({
                "emotion": row["emotion"],
                "timestamp": row["timestamp"]
            })

        return {"data": list(grouped_data.values())}

    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error occurred") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch emotion data: {str(e)}")


@admin_router.get("/get_emotion_stats")
async def get_emotion_stats():
    """
    API to get aggregated emotion statistics from the database.
    This includes total emotions, most common emotions, and mood analysis.
    """
    query = """
        SELECT emotion, COUNT(*) AS count
        FROM emotions
        GROUP BY emotion
        ORDER BY count DESC
    """
    params = {}

    try:
        rows = await database.fetch_all(query, params)

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
