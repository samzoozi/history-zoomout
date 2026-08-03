"""generalize civilizations into topics with category

Revision ID: d32bebd9ce1d
Revises: 640fa704dd20
Create Date: 2026-08-02 21:44:44.862050

"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "d32bebd9ce1d"
down_revision: str | Sequence[str] | None = "640fa704dd20"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.rename_table("civilizations", "topics")
    op.alter_column("events", "civilization_id", new_column_name="topic_id")

    op.add_column("topics", sa.Column("category", sa.String(), nullable=True))
    op.execute("UPDATE topics SET category = 'civilization' WHERE category IS NULL")
    op.alter_column("topics", "category", nullable=False)
    op.create_index(op.f("ix_topics_category"), "topics", ["category"])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f("ix_topics_category"), table_name="topics")
    op.drop_column("topics", "category")

    op.alter_column("events", "topic_id", new_column_name="civilization_id")
    op.rename_table("topics", "civilizations")
