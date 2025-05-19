from sqlalchemy import String, Integer,Func, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models import db
from typing import TYPE_CHECKING, List  

if TYPE_CHECKING:
    from .user import User
    
status_state = Enum('Iniciado', 'finalizado', name='status_enum')

class Follow_up(db.Model):
    __tablename__ = "follow_up"
    follow_up_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    users_id: Mapped[int] = mapped_column(ForeignKey('users.users_id'), nullable=False)
    errand_name: Mappedl[str] = mapped_column(String(250), nullable=False)
    status_type: Mapped[str] = mapped_column(status_state, nullable=False)
    expiration_date: Mapped[Date] = mapped_column(nullable=True)
    

    user: Mapped[List["User"]] = relationship("User", back_populates="follow_up", foreign_keys=[users_id])



    def serialize(self):
        return {
            "follow_up_id": self.follow_up_id,
            "users_id": self.users_id,
            "errand_name": self.errand_name,
            "status_type:": self.status_type,
            "expiration_date:": self.expiration_date,
        }
