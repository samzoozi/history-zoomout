from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base


class Civilization(Base):
    __tablename__ = "civilizations"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    color_index: Mapped[int] = mapped_column(Integer, nullable=False)
    start_year: Mapped[int] = mapped_column(Integer, nullable=False)
    end_year: Mapped[int] = mapped_column(Integer, nullable=False)

    events: Mapped[list["Event"]] = relationship(
        back_populates="civilization",
        order_by="Event.year",
        cascade="all, delete-orphan",
    )


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    civilization_id: Mapped[str] = mapped_column(ForeignKey("civilizations.id"), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    sig: Mapped[str] = mapped_column(String, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)

    civilization: Mapped["Civilization"] = relationship(back_populates="events")
