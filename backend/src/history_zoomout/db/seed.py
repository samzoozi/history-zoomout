import argparse
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


def seed(category: str | None = None) -> None:
    Base.metadata.create_all(bind=engine)

    all_category_dirs = sorted(p for p in SEED_DATA_DIR.iterdir() if p.is_dir())
    if category is not None:
        category_dirs = [p for p in all_category_dirs if p.name == category]
        if not category_dirs:
            available = ", ".join(p.name for p in all_category_dirs)
            raise SystemExit(f"Unknown category {category!r}; available: {available}")
    else:
        category_dirs = all_category_dirs

    db = SessionLocal()
    try:
        if category is None:
            db.query(Event).delete()
            db.query(Location).delete()
            db.query(Topic).delete()
        else:
            # Only this category's rows -- a single-category reseed must
            # leave every other category's data untouched.
            topic_ids = [
                row[0] for row in db.query(Topic.id).filter(Topic.category == category)
            ]
            db.query(Event).filter(Event.topic_id.in_(topic_ids)).delete(
                synchronize_session=False
            )
            db.query(Location).filter(~Location.events.any()).delete(
                synchronize_session=False
            )
            db.query(Topic).filter(Topic.category == category).delete(
                synchronize_session=False
            )
        db.flush()

        total = 0
        for category_dir in category_dirs:
            cat = category_dir.name
            topics = load_category(category_dir)
            for topic in topics:
                db.add(
                    Topic(
                        id=topic["id"],
                        category=cat,
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
        print(f"Seeded {total} topics across {len(category_dirs)} categories.")
    finally:
        db.close()


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Seed the database from data/seed_data/."
    )
    parser.add_argument(
        "category",
        nargs="?",
        default=None,
        help="Only (re)seed this category, e.g. 'country' -- other categories' "
        "data is left untouched. Seeds every category if omitted.",
    )
    args = parser.parse_args()
    seed(args.category)


if __name__ == "__main__":
    main()
