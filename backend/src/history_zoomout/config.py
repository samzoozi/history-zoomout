import os

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    database_url: str = "postgresql+psycopg://history_zoomout:history_zoomout@localhost:5432/history_zoomout"
    cors_origins: list[str] = ["*"]


settings = Settings()

# In Lambda, the Neon connection string lives in Secrets Manager rather than
# a .env file (there's no live value to bake in at synth time). Local dev is
# unaffected since DB_SECRET_ARN is only set on the deployed function.
_db_secret_arn = os.environ.get("DB_SECRET_ARN")
if _db_secret_arn:
    import boto3

    _client = boto3.client("secretsmanager")
    settings.database_url = _client.get_secret_value(SecretId=_db_secret_arn)[
        "SecretString"
    ]
