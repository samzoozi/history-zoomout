# HistoryRewind

An interactive timeline of world civilizations — see the defining moments of Mesopotamia,
Egypt, Rome, China, and more laid out side by side, zoomable from the Bronze Age to the
Age of Contact.

## Structure

```
backend/             FastAPI service + Postgres models, managed with uv
frontend/            Timeline UI (HTML/CSS/JS, no build step) — fetches data from the backend API
infra/               AWS CDK (Python) app defining the deployment, managed with uv
docker-compose.yml   Local Postgres for development
```

`backend/` and `infra/` are separate uv projects (each with its own `pyproject.toml`, `.python-version`,
and lockfile) — kept apart deliberately, since `infra/`'s CDK tooling is dev-only and should never leak
into what eventually gets packaged and deployed as the backend's runtime.

## Running things locally

The frontend reads civilization/event data from the backend API, which reads from Postgres — so
bring things up in this order:

**1. Database**
```
docker compose up -d
```

**2. Backend** — migrates, seeds, and serves the API on port 8000:
```
cd backend
uv run alembic upgrade head
uv run historyrewind-seed
uv run uvicorn historyrewind.main:app --reload --port 8000
```

**3. Frontend** — no build step; serve it on a different port than the API:
```
cd frontend
python3 -m http.server 5500
# visit http://localhost:5500
```

See [`backend/README.md`](backend/README.md) for more on migrations and re-seeding.

**Infra** — see [`infra/README.md`](infra/README.md). `cdk synth` is safe to run locally;
`cdk deploy` provisions real, billable AWS resources.
