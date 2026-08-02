from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    database_url: str = "postgresql+psycopg://historyrewind:historyrewind@localhost:5432/historyrewind"
    cors_origins: list[str] = ["*"]


settings = Settings()
