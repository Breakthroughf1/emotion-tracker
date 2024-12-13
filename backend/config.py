from pydantic_settings import BaseSettings
from dotenv import load_dotenv
from databases import Database

# Load environment variables from .env file
load_dotenv()


class Settings(BaseSettings):
    SECRET_KEY: str
    DATABASE_URL: str

    class Config:
        env_file = ".env"  # Specify the dotenv file to use


# Instantiate settings
settings = Settings()

# Instantiate the Database connection
database = Database(settings.DATABASE_URL)
