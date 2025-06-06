"""empty message

Revision ID: 5f78454b819a
Revises: 
Create Date: 2025-06-04 19:16:04.550429

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5f78454b819a'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('errand_type',
    sa.Column('errand_type_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=250), nullable=False),
    sa.Column('description', sa.String(length=250), nullable=False),
    sa.PrimaryKeyConstraint('errand_type_id')
    )
    op.create_table('offices',
    sa.Column('office_id', sa.Integer(), nullable=False),
    sa.Column('office_name', sa.String(length=250), nullable=False),
    sa.Column('street_name', sa.String(length=250), nullable=False),
    sa.Column('postal_code', sa.Integer(), nullable=True),
    sa.Column('coordinates', sa.String(length=2083), nullable=True),
    sa.PrimaryKeyConstraint('office_id')
    )
    op.create_table('users',
    sa.Column('users_id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=250), nullable=False),
    sa.Column('password', sa.String(length=250), nullable=False),
    sa.PrimaryKeyConstraint('users_id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('errand',
    sa.Column('errand_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=250), nullable=False),
    sa.Column('procedures', sa.String(length=4500), nullable=False),
    sa.Column('requirements', sa.String(length=2083), nullable=False),
    sa.Column('country', sa.String(length=250), nullable=False),
    sa.Column('errand_type_id', sa.Integer(), nullable=False),
    sa.Column('office_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['errand_type_id'], ['errand_type.errand_type_id'], ),
    sa.ForeignKeyConstraint(['office_id'], ['offices.office_id'], ),
    sa.PrimaryKeyConstraint('errand_id')
    )
    op.create_table('follow_up',
    sa.Column('follow_up_id', sa.Integer(), nullable=False),
    sa.Column('users_id', sa.Integer(), nullable=False),
    sa.Column('errand_name', sa.String(length=250), nullable=False),
    sa.Column('status_type', sa.Enum('Iniciado', 'finalizado', name='status_enum'), nullable=False),
    sa.Column('reference_date', sa.DateTime(), nullable=True),
    sa.Column('form_data', sa.String(length=2038), nullable=True),
    sa.Column('documentation', sa.String(length=2038), nullable=True),
    sa.Column('description', sa.String(length=2038), nullable=True),
    sa.ForeignKeyConstraint(['users_id'], ['users.users_id'], ),
    sa.PrimaryKeyConstraint('follow_up_id')
    )
    op.create_table('favorites',
    sa.Column('favorites_id', sa.Integer(), nullable=False),
    sa.Column('users_id', sa.Integer(), nullable=False),
    sa.Column('errand_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['errand_id'], ['errand.errand_id'], ),
    sa.ForeignKeyConstraint(['users_id'], ['users.users_id'], ),
    sa.PrimaryKeyConstraint('favorites_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('favorites')
    op.drop_table('follow_up')
    op.drop_table('errand')
    op.drop_table('users')
    op.drop_table('offices')
    op.drop_table('errand_type')
    # ### end Alembic commands ###
