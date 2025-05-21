from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from api.models import db
from typing import TYPE_CHECKING,  List

if TYPE_CHECKING:
    from .errand import Errand


class Errand_type(db.Model):
    __tablename__ = "errand_type"
    errand_type_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(250), nullable=False)
    description: Mapped[str] = mapped_column(String(250), nullable=False)
    
    errand: Mapped[List["Errand"]] = relationship(
        "Errand", back_populates="errand_type")

    def serialize(self):
        return {
            "errand_type_id": self.errand_type_id,
            "name": self.name,
            "description": self.description,
        }
