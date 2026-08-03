from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from .config import settings
from .db import SessionLocal
from .db.models import Topic
from .schemas import TopicOut

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


@app.get("/topics", response_model=list[TopicOut])
def list_topics(category: str):
    db = SessionLocal()
    try:
        stmt = (
            select(Topic)
            .where(Topic.category == category)
            .options(selectinload(Topic.events))
            .order_by(Topic.start_year)
        )
        return db.scalars(stmt).all()
    finally:
        db.close()
