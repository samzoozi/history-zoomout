from sqlalchemy import ARRAY, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from . import Base


class Topic(Base):
    """A thing that has a history: a civilization, country, sport, etc.

    `category` discriminates which domain a row belongs to (e.g.
    "civilization") so future domains can share this table instead of
    each needing their own.
    """

    __tablename__ = "topics"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    category: Mapped[str] = mapped_column(String, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    color_index: Mapped[int] = mapped_column(Integer, nullable=False)
    start_year: Mapped[int] = mapped_column(Integer, nullable=False)
    end_year: Mapped[int] = mapped_column(Integer, nullable=False)

    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    source_url: Mapped[str | None] = mapped_column(String, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String, nullable=True)
    image_attribution: Mapped[str | None] = mapped_column(String, nullable=True)
    image_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    wikidata_id: Mapped[str | None] = mapped_column(String, nullable=True)

    events: Mapped[list[Event]] = relationship(
        back_populates="topic",
        order_by="Event.year",
        cascade="all, delete-orphan",
    )


class Location(Base):
    """A place an event happened, named both historically and as it maps today.

    `historical_name` is the place as it was known at the time (e.g.
    "Carrhae"); `city` and `country` are its modern-day equivalents (e.g.
    "Harran", "Turkey"), since these often differ from the historical
    name/borders.
    """

    __tablename__ = "locations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    historical_name: Mapped[str | None] = mapped_column(String, nullable=True)
    city: Mapped[str | None] = mapped_column(String, nullable=True)
    country: Mapped[str | None] = mapped_column(String, nullable=True)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)

    events: Mapped[list[Event]] = relationship(back_populates="location")


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    topic_id: Mapped[str] = mapped_column(ForeignKey("topics.id"), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    sig: Mapped[str] = mapped_column(String, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    tags: Mapped[list[str]] = mapped_column(
        ARRAY(String), nullable=False, default=list, server_default="{}"
    )

    source_url: Mapped[str | None] = mapped_column(String, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String, nullable=True)
    image_attribution: Mapped[str | None] = mapped_column(String, nullable=True)
    image_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    wikidata_id: Mapped[str | None] = mapped_column(String, nullable=True)

    location_id: Mapped[int | None] = mapped_column(
        ForeignKey("locations.id"), nullable=True
    )

    topic: Mapped[Topic] = relationship(back_populates="events")
    location: Mapped[Location | None] = relationship(back_populates="events")
