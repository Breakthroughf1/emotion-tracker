from fastapi import APIRouter, HTTPException, Header
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
