"""add locations table and event location_id

Revision ID: b121ff8c2405
Revises: d73965259b8a
Create Date: 2026-08-02 22:35:17.071770

"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "b121ff8c2405"
down_revision: str | Sequence[str] | None = "d73965259b8a"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "locations",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("historical_name", sa.String(), nullable=True),
        sa.Column("city", sa.String(), nullable=True),
        sa.Column("country", sa.String(), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.add_column("events", sa.Column("location_id", sa.Integer(), nullable=True))
    op.create_foreign_key(
        "events_location_id_fkey", "events", "locations", ["location_id"], ["id"]
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint("events_location_id_fkey", "events", type_="foreignkey")
    op.drop_column("events", "location_id")
    op.drop_table("locations")
