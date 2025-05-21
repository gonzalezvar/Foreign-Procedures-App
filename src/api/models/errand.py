from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from api.models import db
from typing import TYPE_CHECKING, List

if TYPE_CHECKING:
    from .errand_types import Errand_type
    from .offices import Offices
    from .favorites import Favorites


class Errand(db.Model):
    __tablename__ = "errand"
    errand_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(250), nullable=False)
    description: Mapped[str] = mapped_column(String(250), nullable=False)
    instructions: Mapped[str] = mapped_column(String(250), nullable=False)
    requirements: Mapped[str] = mapped_column(String(2083), nullable=False)
    "segun lo investigado con el maximo de caracteres que puede haber en una url es de 2083"
    country: Mapped[str] = mapped_column(String(250), nullable=False)

    errand_type_id: Mapped[int] = mapped_column(
        ForeignKey('errand_type.errand_type_id'), nullable=False)
    errand_type: Mapped["Errand_type"] = relationship(
        "Errand_type", back_populates="errand", foreign_keys=[errand_type_id])
    
    office_id: Mapped[int] = mapped_column(
        ForeignKey('offices.office_id'), nullable=False)
    offices: Mapped["Offices"] = relationship(
        "Offices", back_populates="errand", foreign_keys=[office_id])
    

    favorites: Mapped[List["Favorites"]] = relationship(
        "Favorites", back_populates="errand")

    def serialize(self):
        return {
            "errand_id": self.errand_id,
            "name": self.name,
            "description": self.description,
            "instructions": self.instructions,
            "requirements": self.requirements,
            "country": self.country
        }

    def serialize_with_relations(self):
        data = self.serialize()
        data['errand_type'] = self.errand_type.serialize()
        data['offices'] = self.offices.serialize() if self.offices else {}
        data['favorites'] = self.favorites.serialize() if self.favorites else {}
        return data
