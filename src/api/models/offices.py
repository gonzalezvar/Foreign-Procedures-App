from sqlalchemy import String, Integer, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from api.models import db
from typing import TYPE_CHECKING, List

if TYPE_CHECKING:
    from .errand import Errand


class Offices(db.Model):
    __tablename__ = "offices"
    office_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    office_name: Mapped[str] = mapped_column(String(250), nullable=False)
    street_name: Mapped[str] = mapped_column(String(250), nullable=False)
    postal_code: Mapped[int] = mapped_column(Integer, nullable=True)
    coordinates: Mapped[str] = mapped_column(String(2083), nullable=True)
    #Por si se quiere crear un diccionario con todas coordenadas den las ciudades del país lo del 2083, como máximo estimado

    errand_list: Mapped[List["Errand"]] = relationship(
        "Errand", back_populates="offices")

    def serialize(self):
        return {
            "office_id": self.office_id,
            "office_name": self.office_name,
            "street_name": self.street_name,
            "postal_code": self.postal_code,
            "coordinates": self.coordinates,
        }

    def serialize_with_relations(self):
        data = self.serialize()
        data['errands'] = [err.serialize() for err in self.errand_list]
        return data
