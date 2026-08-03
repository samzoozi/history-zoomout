"""Display labels for `Topic.category` values.

Categories with seeded data but no entry here still work -- `main.py` falls
back to a title-cased id -- but a real label should be added here as soon as a
new category's seed data lands.
"""

CATEGORY_LABELS: dict[str, str] = {
    "civilization": "Civilizations",
}
