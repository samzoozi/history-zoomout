from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    database_url: str = "postgresql+psycopg://history_zoomout:history_zoomout@localhost:5432/history_zoomout"
    cors_origins: list[str] = ["*"]


settings = Settings()
