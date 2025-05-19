from sqlalchemy import String, Integer, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models import db
from typing import TYPE_CHECKING, List  

if TYPE_CHECKING:
    from .errand import Errand
    

class Offices(db.Model):
    __tablename__ = "offices"
    office_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    street_name: Mapped[str] = mapped_column(String(250), nullable=False)
    postal_code: Mapped[int] = mapped_column(Integer, nullable=True)
    coordinates: Mapped[str] = mapped_column(String(250), nullable=True)
    
    

    errand: Mapped[List["Errand"]] = relationship("Errand", back_populates="offices")


    def serialize(self):
        return {
            "office_id": self.office_id,
            "street_name": self.street_name,
            "postal_code": self.postal_code,
            "coordinates": self.status_type,
        }

