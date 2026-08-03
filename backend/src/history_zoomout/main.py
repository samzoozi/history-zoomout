from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, select
from sqlalchemy.orm import selectinload

from .categories import CATEGORY_LABELS
from .config import settings
from .db import SessionLocal
from .db.models import Event, Topic
from .schemas import CategoryOut, TopicOut

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


@app.get("/categories", response_model=list[CategoryOut])
def list_categories():
    db = SessionLocal()
    try:
        stmt = select(Topic.category, func.count(Topic.id)).group_by(Topic.category)
        rows = db.execute(stmt).all()
        return [
            {
                "id": category,
                "label": CATEGORY_LABELS.get(category, category.title()),
                "count": count,
            }
            for category, count in rows
        ]
    finally:
        db.close()


@app.get("/topics", response_model=list[TopicOut])
def list_topics(category: str):
    db = SessionLocal()
    try:
        stmt = (
            select(Topic)
            .where(Topic.category == category)
            .options(selectinload(Topic.events).selectinload(Event.location))
            .order_by(Topic.start_year)
        )
        return db.scalars(stmt).all()
    finally:
        db.close()
