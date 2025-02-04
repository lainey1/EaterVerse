"""updated model relationships

Revision ID: 896e68d98e4b
Revises: edd9ee5ad4f2
Create Date: 2025-01-07 01:11:43.169698

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '896e68d98e4b'
down_revision = 'edd9ee5ad4f2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('restaurants', schema=None) as batch_op:
        batch_op.alter_column('price_point',
               existing_type=sa.INTEGER(),
               nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('restaurants', schema=None) as batch_op:
        batch_op.alter_column('price_point',
               existing_type=sa.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###
