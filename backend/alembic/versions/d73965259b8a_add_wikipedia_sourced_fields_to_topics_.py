"""add wikipedia-sourced fields to topics and events

Revision ID: d73965259b8a
Revises: d32bebd9ce1d
Create Date: 2026-08-02 22:16:09.274991

"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "d73965259b8a"
down_revision: str | Sequence[str] | None = "d32bebd9ce1d"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("topics", sa.Column("summary", sa.Text(), nullable=True))
    op.add_column("topics", sa.Column("source_url", sa.String(), nullable=True))
    op.add_column("topics", sa.Column("image_url", sa.String(), nullable=True))
    op.add_column("topics", sa.Column("image_attribution", sa.String(), nullable=True))
    op.add_column("topics", sa.Column("wikidata_id", sa.String(), nullable=True))

    op.add_column("events", sa.Column("source_url", sa.String(), nullable=True))
    op.add_column("events", sa.Column("image_url", sa.String(), nullable=True))
    op.add_column("events", sa.Column("image_attribution", sa.String(), nullable=True))
    op.add_column("events", sa.Column("wikidata_id", sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("events", "wikidata_id")
    op.drop_column("events", "image_attribution")
    op.drop_column("events", "image_url")
    op.drop_column("events", "source_url")

    op.drop_column("topics", "wikidata_id")
    op.drop_column("topics", "image_attribution")
    op.drop_column("topics", "image_url")
    op.drop_column("topics", "source_url")
    op.drop_column("topics", "summary")
