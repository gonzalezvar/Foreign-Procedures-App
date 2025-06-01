from sqlalchemy import String, Integer, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from api.models import db
from typing import TYPE_CHECKING, List
from datetime import datetime

if TYPE_CHECKING:
    from .users import User

status_state = Enum('Iniciado', 'Finalizado', name='status_enum')


class Follow_up(db.Model):
    __tablename__ = "follow_up"
    follow_up_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    users_id: Mapped[int] = mapped_column(
        ForeignKey('users.users_id'), nullable=False)
    errand_name: Mapped[str] = mapped_column(
        String(250), nullable=False)  # errand_id?
    status_type: Mapped[str] = mapped_column(status_state, nullable=False)
    reference_date: Mapped[datetime] = mapped_column(nullable=True)
    # Posible implementación a futuro de almacennaje de información de una consulta para una API IA, por ejemplo
    form_data: Mapped[str] = mapped_column(String(2038), nullable=True)
    # # Para intentar en un futuro agregar documentos de los users
    documentacion: Mapped[str] = mapped_column(String(2038), nullable=True)
    # permitir al usuario agregar una descripcion del tramite
    descripcion: Mapped[str] = mapped_column(String(2038), nullable=True)

    # Relationships
    user: Mapped["User"] = relationship(
        "User", back_populates="follow_up", foreign_keys=[users_id])

    def serialize(self):
        return {
            "follow_up_id": self.follow_up_id,
            "errand_name": self.errand_name,
            "status_type": self.status_type,
            # format expiration_date to string
            "reference_date": self.reference_date.strftime('%Y-%m-%d') if self.reference_date else None,
            "form_data": self.form_data,
            "documentacion": self.documentacion,
            "descripcion": self.descripcion
        }

    def serialize_with_relations(self):
        data = self.serialize()
        data['user'] = self.user.serialize() if self.user else {}
        return data
