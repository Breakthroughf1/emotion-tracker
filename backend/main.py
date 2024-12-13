# Database connection
import sqlalchemy
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import database
# Routes
from routes.auth_routes import auth_router

app = FastAPI()

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

metadata = sqlalchemy.MetaData()
app.include_router(auth_router, prefix="/auth")


@app.on_event("startup")
async def startup():
    await database.connect()
    # Ensure the table exists
    create_users_table = """
        CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT FALSE,
    account_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    face_data_path VARCHAR(255),
    last_login TIMESTAMP
)
        """
    await database.execute(create_users_table)


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


print("Database connection successful")
