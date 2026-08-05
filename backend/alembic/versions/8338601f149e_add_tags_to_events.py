"""add tags to events

Revision ID: 8338601f149e
Revises: 5bf180c12988
Create Date: 2026-08-04 22:30:03.906487

"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "8338601f149e"
down_revision: str | Sequence[str] | None = "5bf180c12988"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "events",
        sa.Column(
            "tags",
            sa.ARRAY(sa.String()),
            nullable=False,
            server_default="{}",
        ),
    )
    op.create_index(
        "ix_events_tags",
        "events",
        ["tags"],
        postgresql_using="gin",
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index("ix_events_tags", table_name="events")
    op.drop_column("events", "tags")
