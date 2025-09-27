# xpensmat/core/config.py
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "XPenSmat"
    DATA_DIR: str = os.getenv("XPENSMAT_DATA_DIR", "./data")
    DB_PATH: str = os.getenv("XPENSMAT_DB", "./data/xpensmat.db")
    APPWRITE_ENDPOINT: str | None = os.getenv("APPWRITE_ENDPOINT")
    APPWRITE_PROJECT: str | None = os.getenv("APPWRITE_PROJECT")
    P2P_PORT: int = int(os.getenv("P2P_PORT", "8765"))
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    class Config:
        env_file = ".env"

settings = Settings()
