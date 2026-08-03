import json
from importlib import resources

from . import Base, SessionLocal, engine
from .models import Event, Location, Topic


def load_seed_data() -> list[dict]:
    path = resources.files("history_zoomout.db.seed_data").joinpath(
        "civilizations.json"
    )
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
    civilizations = load_seed_data()

    db = SessionLocal()
    try:
        db.query(Event).delete()
        db.query(Location).delete()
        db.query(Topic).delete()
        db.flush()

        for civ in civilizations:
            db.add(
                Topic(
                    id=civ["id"],
                    category="civilization",
                    name=civ["name"],
                    color_index=civ["colorIndex"],
                    start_year=civ["start"],
                    end_year=civ["end"],
                    summary=civ.get("summary"),
                    source_url=civ.get("sourceUrl"),
                    image_url=civ.get("imageUrl"),
                    image_attribution=civ.get("imageAttribution"),
                    wikidata_id=civ.get("wikidataId"),
                    events=[
                        Event(
                            year=ev["year"],
                            sig=ev["sig"],
                            title=ev["title"],
                            body=ev["body"],
                            source_url=ev.get("sourceUrl"),
                            image_url=ev.get("imageUrl"),
                            image_attribution=ev.get("imageAttribution"),
                            wikidata_id=ev.get("wikidataId"),
                            location=build_location(ev.get("location")),
                        )
                        for ev in civ["events"]
                    ],
                )
            )
        db.commit()
        print(f"Seeded {len(civilizations)} civilizations.")
    finally:
        db.close()


def main() -> None:
    seed()


if __name__ == "__main__":
    main()
