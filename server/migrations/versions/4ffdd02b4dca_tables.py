"""tables

Revision ID: 4ffdd02b4dca
Revises: d6e6bdef83ce
Create Date: 2023-05-23 10:43:03.185606

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4ffdd02b4dca'
down_revision = 'd6e6bdef83ce'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('post', schema=None) as batch_op:
        batch_op.alter_column('conversation',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('post', schema=None) as batch_op:
        batch_op.alter_column('conversation',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=False)

    # ### end Alembic commands ###
