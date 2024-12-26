import os
import sqlalchemy
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import database
from importlib import import_module

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

# Dynamically include all routers from the routes folder
for filename in os.listdir("routes"):
    if filename.endswith("_routes.py"):
        module_name = filename[:-3]  # Remove .py extension
        prefix = module_name.split("_")[0]  # Extract the prefix before _
        module = import_module(f"routes.{module_name}")
        if hasattr(module, f"{prefix}_router"):
            router = getattr(module, f"{prefix}_router")
            app.include_router(router, prefix=f"/{prefix}")


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
