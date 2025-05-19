from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models import db
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .errand import Errand 


class Errand_type(db.Model):
    __tablename__ = "errand_type"
    errand_type_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(250), nullable=False)
    description: Mapped[str] = mapped_column(String(250), nullable=False)
    errand_id: Mapped[int] = mapped_column(ForeignKey('errand.errand_id'), nullable=True)
    errand: Mapped["Errand"] = relationship("Errand", back_populates="errand_types", foreign_keys=[errand_id])

 
    def serialize(self):
        return {
            "errand_type_id": self.errand_type_id,
            "name": self.name,
            "description": self.description,
        }
