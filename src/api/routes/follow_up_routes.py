from flask import Blueprint, jsonify, request
from api.models.errand import Errand
from api.models import db
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from api.models.follow_up import Follow_up
from datetime import datetime


follow_up_bp = Blueprint('user_follow_up', __name__)


@follow_up_bp.route("/user_follow_ups", methods=["POST"])
@jwt_required()
def create_user_follow_up():
    users_id = (int(get_jwt_identity()))
    data = request.get_json()

    errand_name = data['errand_name']
    status_type = data['status_type']
    description = data['description']
    reference_date = data.get('reference_date')

    if not errand_name or not status_type:
        return jsonify({"message": "errand_name y status_type son requeridos"}), 400

    if status_type == "finalizado" and not reference_date:
        return jsonify({"message": "reference_date es requerida si el trámite está finalizado"}), 400

    try:
        reference_date_parsed = datetime.strptime(
            reference_date, "%Y-%m-%d") if reference_date else datetime.now()
    except Exception as e:
        print(e)
        return jsonify({"message": "Formato de fecha inválido, debe ser YYYY-MM-DD"}), 400

    new_follow_up = Follow_up(
        users_id=users_id,
        errand_name=errand_name,
        status_type=status_type,
        reference_date=reference_date_parsed,
        description=description
    )

    try:
        db.session.add(new_follow_up)
        db.session.commit()
        return jsonify({"msg": "Se creo una tarea de seguimiento"}), 201
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error en el servidor"}), 500


@follow_up_bp.route("/user_follow_ups/<int:follow_up_id>", methods=["PUT"])
@jwt_required()
def update_follow_up(follow_up_id):
    users_id = get_jwt_identity()
    follow_up = Follow_up.query.filter_by(
        follow_up_id=follow_up_id, users_id=users_id).first()

    if not follow_up:
        return jsonify({"message": "No se encontró tarea de seguimiento"}), 404

    data = request.get_json()

    follow_up.errand_name = data.get('errand_name', follow_up.errand_name)
    follow_up.status_type = data.get('status_type', follow_up.status_type)
    follow_up.description = data.get('description', follow_up.description)

    if follow_up.status_type == "finalizado":
        expiration = data.get('reference_date')
        if not expiration:
            follow_up.reference_date = datetime.strptime(expiration, "%Y-%m-%d")
        elif not follow_up.reference_date:
            return jsonify({"message": "reference_date es requerida si el trámite está finalizado"}), 400
 
    try:
        db.session.add(follow_up)
        db.session.commit()
        return jsonify({"msg": "Se modificó una tarea de seguimiento"}), 201
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error en el servidor"}), 500

@follow_up_bp.route("/user_follow_ups/<int:follow_up_id>", methods=["DELETE"])
@jwt_required()
def delete_follow_up(follow_up_id):
    users_id = get_jwt_identity()

    follow_up = Follow_up.query.filter_by(
        follow_up_id=follow_up_id, users_id=users_id
    ).first()

    if not follow_up:
        return jsonify({"message": "No se encontró tarea de seguimiento"}), 404

    try:
        db.session.delete(follow_up)
        db.session.commit()
        return jsonify({"msg": "Se eliminó la tarea de seguimiento"}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error al eliminar la tarea de seguimiento"}), 500
