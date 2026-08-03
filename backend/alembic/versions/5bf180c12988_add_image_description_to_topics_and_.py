"""add image_description to topics and events

Revision ID: 5bf180c12988
Revises: b121ff8c2405
Create Date: 2026-08-03 12:41:07.000000

"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "5bf180c12988"
down_revision: str | Sequence[str] | None = "b121ff8c2405"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("topics", sa.Column("image_description", sa.Text(), nullable=True))
    op.add_column("events", sa.Column("image_description", sa.Text(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("events", "image_description")
    op.drop_column("topics", "image_description")
