import json
from pathlib import Path

from . import Base, SessionLocal, engine
from .models import Event, Location, Topic

# Repo root, e.g. backend/src/history_zoomout/db/seed.py -> repo/
REPO_ROOT = Path(__file__).resolve().parents[4]
SEED_DATA_DIR = REPO_ROOT / "data" / "seed_data"

# Each subfolder of data/seed_data/ is a category; each *.json file inside it
# is one topic. Add a new category by creating its subfolder -- seeding logic
# itself doesn't need to change.


def load_category(category_dir: Path) -> list[dict]:
    return [
        json.loads(path.read_text()) for path in sorted(category_dir.glob("*.json"))
    ]


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

        categories = sorted(p for p in SEED_DATA_DIR.iterdir() if p.is_dir())
        total = 0
        for category_dir in categories:
            category = category_dir.name
            topics = load_category(category_dir)
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
        print(f"Seeded {total} topics across {len(categories)} categories.")
    finally:
        db.close()


def main() -> None:
    seed()


if __name__ == "__main__":
    main()
