from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from api.models import db
from typing import TYPE_CHECKING, List  # Importa List

if TYPE_CHECKING:
    from .users import User
    from .errand import Errand



class Favorites(db.Model):
    __tablename__ = "favorites"
    favorites_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    users_id: Mapped[int] = mapped_column(
        ForeignKey('users.users_id'), nullable=False)
    errand_id: Mapped[int] = mapped_column(
        ForeignKey('errand.errand_id'), nullable=False)

    user: Mapped["User"] = relationship(
        "User", back_populates="favorites", foreign_keys=[users_id])
    errand: Mapped["Errand"] = relationship(
        "Errand", back_populates="favorites", foreign_keys=[errand_id])


def serialize(self):
    return {
        'favorites_id': self.favorites_id,
    }


def serialize_with_relations(self):
    data = self.serialize()
    data['user'] = self.user.serialize() if self.user else {}
    data['errand'] = self.errand.serialize() if self.errand else {}
    return data
