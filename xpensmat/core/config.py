"""Application settings loaded from environment variables and ``.env``."""

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", extra="ignore", populate_by_name=True
    )

    APP_NAME: str = Field(
        "XPenSmat",
        validation_alias=AliasChoices("XPENSMAT_APP_NAME", "APP_NAME"),
    )
    DATA_DIR: str = Field(
        "./data",
        validation_alias=AliasChoices("XPENSMAT_DATA_DIR", "DATA_DIR"),
    )
    DB_PATH: str = Field(
        "./data/xpensmat.db",
        validation_alias=AliasChoices("XPENSMAT_DB", "DB_PATH"),
    )
    MODEL_DIR: str = Field(
        "./experiments/models",
        validation_alias=AliasChoices("XPENSMAT_MODEL_DIR", "MODEL_DIR"),
    )
    APPWRITE_ENDPOINT: str | None = Field(
        None,
        validation_alias=AliasChoices(
            "APPWRITE_ENDPOINT", "XPENSMAT_APPWRITE_ENDPOINT"
        ),
    )
    APPWRITE_PROJECT: str | None = Field(
        None,
        validation_alias=AliasChoices(
            "APPWRITE_PROJECT", "XPENSMAT_APPWRITE_PROJECT"
        ),
    )
    P2P_PORT: int = Field(
        8765, validation_alias=AliasChoices("P2P_PORT", "XPENSMAT_P2P_PORT")
    )
    LOG_LEVEL: str = Field(
        "INFO", validation_alias=AliasChoices("LOG_LEVEL", "XPENSMAT_LOG_LEVEL")
    )
    # Demo mode inserts synthetic bank transactions; it must be opt-in.
    DEMO_MODE: bool = Field(
        False, validation_alias=AliasChoices("XPENSMAT_DEMO_MODE", "DEMO_MODE")
    )


settings = Settings()
