from fastapi import APIRouter, HTTPException, Query
from sqlalchemy.exc import SQLAlchemyError
from config import database
from schemas.user_schemas import EmotionRequest
from datetime import datetime, timedelta

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
        user_id: str = Query(None, description="The ID of the user to fetch aggregated emotion data for")):
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
    if user_id:
        query = """
            SELECT emotion, COUNT(*) AS count
            FROM emotions
            WHERE user_id = :user_id
            GROUP BY emotion
            ORDER BY count DESC
        """
        params = {"user_id": user_id}
    else:
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


@user_router.get("/get_emotion_trends")
async def get_emotion_trends(user_id: str = Query(..., description="The ID of the user to fetch emotion trends for")):
    """
    API to get emotional trends (time-based) for a specific user.
    This includes emotion counts over time (e.g., daily or weekly).
    """
    query = """
        SELECT emotion, DATE(timestamp) AS date, COUNT(*) AS count
        FROM emotions
        WHERE user_id = :user_id
        GROUP BY emotion, date
        ORDER BY date ASC
    """
    try:
        rows = await database.fetch_all(query, {"user_id": user_id})

        # Process the results to return useful data
        trend_data = {}
        for row in rows:
            date = row['date']
            emotion = row['emotion']
            count = row['count']

            if date not in trend_data:
                trend_data[date] = {}

            trend_data[date][emotion] = count

        return {
            "emotion_trends": trend_data
        }
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error occurred") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch emotion trends: {str(e)}")


@user_router.get("/get_emotion_stats")
async def get_emotion_stats(
        user_id: str = Query(None, description="The ID of the user to fetch aggregated emotion data for"),
        start_date: str = Query(None, description="Start date (YYYY-MM-DD) for the stats analysis"),
        end_date: str = Query(None, description="End date (YYYY-MM-DD) for the stats analysis")
):
    """
    API to get aggregated emotion statistics from the database within a date range.
    """
    query = """
        SELECT emotion, COUNT(*) AS count
        FROM emotions
        WHERE timestamp BETWEEN :start_date AND :end_date
        GROUP BY emotion
        ORDER BY count DESC
    """
    params = {}
    if user_id:
        query += " AND user_id = :user_id"
        params["user_id"] = user_id

    if start_date and end_date:
        params["start_date"] = start_date
        params["end_date"] = end_date
    else:
        # Default to the last 30 days if no date range is provided
        end_date = datetime.now().strftime('%Y-%m-%d')
        start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        params["start_date"] = start_date
        params["end_date"] = end_date

    try:
        rows = await database.fetch_all(query, params)

        emotions = {row['emotion']: row['count'] for row in rows}

        dominant_emotion = max(emotions, key=emotions.get, default=None)

        return {
            "emotion_stats": rows,
            "dominant_emotion": dominant_emotion,
            "time_period": {"start": start_date, "end": end_date}
        }
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error occurred") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch emotion stats: {str(e)}")
