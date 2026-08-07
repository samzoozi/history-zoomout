# history-zoomout backend

FastAPI service for History Zoomout, managed with [uv](https://docs.astral.sh/uv/).

## Local development

Requires Postgres running (see the root [`docker-compose.yml`](../docker-compose.yml)):

```
docker compose up -d          # from the repo root
```

Then, from this directory:

```
uv run alembic upgrade head    # create/update tables
uv run history-zoomout-seed    # load civilizations.json into Postgres
uv run uvicorn history_zoomout.main:app --reload --port 8000
```

`GET http://localhost:8000/topics?category=civilization` should return all 15 civilizations with their events.

Connection settings (`DATABASE_URL`, `CORS_ORIGINS`) are read from the environment or a `.env`
file in this directory — see `history_zoomout/config.py` for defaults, which match the Postgres
credentials in the root `docker-compose.yml`.

## Migrations

Models live in `history_zoomout/db/models.py`. After changing them:

```
uv run alembic revision --autogenerate -m "describe the change"
uv run alembic upgrade head
```

## Re-seeding

`history-zoomout-seed` clears and reloads all civilizations/events from
`data/seed_data/civilizations.json` (repo root) — safe to re-run.
