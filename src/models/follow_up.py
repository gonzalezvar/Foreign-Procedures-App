from sqlalchemy import String, Integer, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models import db
from typing import TYPE_CHECKING, List  
from datetime import datetime


if TYPE_CHECKING:
    from .user import User
    
status_state = Enum('Iniciado', 'finalizado', name='status_enum')

class Follow_up(db.Model):
    __tablename__ = "follow_up"
    follow_up_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    users_id: Mapped[int] = mapped_column(ForeignKey('users.users_id'), nullable=False)
    errand_name: Mapped[str] = mapped_column(String(250), nullable=False)
    status_type: Mapped[str] = mapped_column(status_state, nullable=False)
    expiration_date: Mapped[datetime] = mapped_column(nullable=True)
    

    user: Mapped[List["User"]] = relationship("User", back_populates="follow_up", foreign_keys=[users_id])



    def serialize(self):
        return {
            "follow_up_id": self.follow_up_id,
            "errand_name": self.errand_name,
            "status_type:": self.status_type,
            "expiration_date:": self.expiration_date,
        }
