# historyrewind backend

FastAPI service for HistoryRewind, managed with [uv](https://docs.astral.sh/uv/).

## Local development

Requires Postgres running (see the root [`docker-compose.yml`](../docker-compose.yml)):

```
docker compose up -d          # from the repo root
```

Then, from this directory:

```
uv run alembic upgrade head    # create/update tables
uv run historyrewind-seed      # load civilizations.json into Postgres
uv run uvicorn historyrewind.main:app --reload --port 8000
```

`GET http://localhost:8000/civilizations` should return all 15 civilizations with their events.

Connection settings (`DATABASE_URL`, `CORS_ORIGINS`) are read from the environment or a `.env`
file in this directory — see `historyrewind/config.py` for defaults, which match the Postgres
credentials in the root `docker-compose.yml`.

## Migrations

Models live in `historyrewind/models.py`. After changing them:

```
uv run alembic revision --autogenerate -m "describe the change"
uv run alembic upgrade head
```

## Re-seeding

`historyrewind-seed` clears and reloads all civilizations/events from
`historyrewind/seed_data/civilizations.json` — safe to re-run.
