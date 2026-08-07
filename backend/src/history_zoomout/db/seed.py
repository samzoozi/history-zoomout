import json
from pathlib import Path

from . import Base, SessionLocal, engine
from .models import Event, Location, Topic

# Repo root, e.g. backend/src/history_zoomout/db/seed.py -> repo/
REPO_ROOT = Path(__file__).resolve().parents[4]
SEED_DATA_DIR = REPO_ROOT / "data" / "seed_data"

# (category, seed_data filename) pairs. Add an entry here once a new
# category's seed file lands under data/seed_data/ -- seeding logic itself
# doesn't need to change.
SEED_FILES = [
    ("civilization", "civilizations.json"),
]


def load_seed_data(filename: str) -> list[dict]:
    path = SEED_DATA_DIR / filename
    return json.loads(path.read_text())


def build_location(loc: dict | None) -> Location | None:
    if loc is None:
        return None
    return Location(
        historical_name=loc.get("historicalName"),
        city=loc.get("city"),
        country=loc.get("country"),
        latitude=loc.get("latitude"),
        longitude=loc.get("longitude"),
    )


def seed() -> None:
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        db.query(Event).delete()
        db.query(Location).delete()
        db.query(Topic).delete()
        db.flush()

        total = 0
        for category, filename in SEED_FILES:
            topics = load_seed_data(filename)
            for topic in topics:
                db.add(
                    Topic(
                        id=topic["id"],
                        category=category,
                        name=topic["name"],
                        color_index=topic["colorIndex"],
                        start_year=topic["start"],
                        end_year=topic["end"],
                        summary=topic.get("summary"),
                        source_url=topic.get("sourceUrl"),
                        image_url=topic.get("imageUrl"),
                        image_attribution=topic.get("imageAttribution"),
                        image_description=topic.get("imageDescription"),
                        wikidata_id=topic.get("wikidataId"),
                        events=[
                            Event(
                                year=ev["year"],
                                sig=ev["sig"],
                                title=ev["title"],
                                body=ev["body"],
                                tags=ev.get("tags", []),
                                source_url=ev.get("sourceUrl"),
                                image_url=ev.get("imageUrl"),
                                image_attribution=ev.get("imageAttribution"),
                                image_description=ev.get("imageDescription"),
                                wikidata_id=ev.get("wikidataId"),
                                location=build_location(ev.get("location")),
                            )
                            for ev in topic["events"]
                        ],
                    )
                )
            total += len(topics)
        db.commit()
        print(f"Seeded {total} topics across {len(SEED_FILES)} categories.")
    finally:
        db.close()


def main() -> None:
    seed()


if __name__ == "__main__":
    main()
