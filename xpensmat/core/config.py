# xpensmat/core/config.py
from __future__ import annotations

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration.

    Environment variables take precedence over the defaults below and are
    also read from a local ``.env`` file.  Both the historical
    ``XPENSMAT_*`` names and the plain field names are accepted.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    APP_NAME: str = "XPenSmat"
    DATA_DIR: str = Field(
        default="./data",
        validation_alias=AliasChoices("XPENSMAT_DATA_DIR", "DATA_DIR"),
    )
    DB_PATH: str = Field(
        default="./data/xpensmat.db",
        validation_alias=AliasChoices("XPENSMAT_DB", "DB_PATH"),
    )
    APPWRITE_ENDPOINT: str | None = None
    APPWRITE_PROJECT: str | None = None
    P2P_PORT: int = 8765
    LOG_LEVEL: str = "INFO"


settings = Settings()
