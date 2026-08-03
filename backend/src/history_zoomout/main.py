from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from .config import settings
from .db import SessionLocal
from .db.models import Civilization
from .schemas import CivilizationOut

app = FastAPI(title="History Zoomout API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/civilizations", response_model=list[CivilizationOut])
def list_civilizations():
    db = SessionLocal()
    try:
        stmt = (
            select(Civilization)
            .options(selectinload(Civilization.events))
            .order_by(Civilization.start_year)
        )
        return db.scalars(stmt).all()
    finally:
        db.close()
