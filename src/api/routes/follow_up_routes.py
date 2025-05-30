from flask import Blueprint, jsonify, request
from api.models.errand import Errand
from api.models import db
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from api.models.follow_up import Follow_up


follow_up_bp = Blueprint('user_follow_up', __name__)

@follow_up_bp.route("/user_follow_ups", methods=["POST"])
@jwt_required() # Requiere JWT para acceder
def create_user_follow_up():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    errand_id = data.get("errand_id")

    if not errand_id:
        return jsonify({"message": "errand_id es requerido"}), 400

    new_follow_up = Follow_up(user_id=current_user_id, errand_id=errand_id)
    db.session.add(new_follow_up)
    db.session.commit()

    return jsonify({
        "id": new_follow_up.follow_up_id,
        "user_id": new_follow_up.user_id,
        "errand_id": new_follow_up.errand_id, #name o id?
        "status": new_follow_up.status_type,
        "expiration_date": new_follow_up.expiration_date,
        "form_data": {} # Inicialmente vacío
    }), 201