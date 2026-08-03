import json
from importlib import resources

from . import Base, SessionLocal, engine
from .models import Civilization, Event


def load_seed_data() -> list[dict]:
    path = resources.files("history_zoomout.db.seed_data").joinpath(
        "civilizations.json"
    )
    return json.loads(path.read_text())


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    civilizations = load_seed_data()

    db = SessionLocal()
    try:
        db.query(Event).delete()
        db.query(Civilization).delete()
        db.flush()

        for civ in civilizations:
            db.add(
                Civilization(
                    id=civ["id"],
                    name=civ["name"],
                    color_index=civ["colorIndex"],
                    start_year=civ["start"],
                    end_year=civ["end"],
                    events=[
                        Event(
                            year=ev["year"],
                            sig=ev["sig"],
                            title=ev["title"],
                            body=ev["body"],
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
