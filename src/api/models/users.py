from sqlalchemy import String, Integer, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from api.models import db
from typing import TYPE_CHECKING, List

if TYPE_CHECKING:
    from .favorites import Favorites
    from .follow_up import Follow_up


class User(db.Model):
    __tablename__ = "users"
    users_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(
        String(250), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(250), nullable=False)

    favorites: Mapped[List["Favorites"]] = relationship(
        "Favorites", back_populates="user")
    follow_up: Mapped[List["Follow_up"]] = relationship(
        "Follow_up", back_populates="user")

    def serialize(self):
        return {
            "users_id": self.users_id,
            "email": self.email,
        }

    def serialize_with_relations(self):
        data = self.serialize()
        data['favorites'] = [f.serialize_with_relations() for f in self.favorites] if self.favorites else []
        data['follow_up'] = [fo.serialize_with_relations() for fo in self.follow_up] if self.follow_up else []
        return data
