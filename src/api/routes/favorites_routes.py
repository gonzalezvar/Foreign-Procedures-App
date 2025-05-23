from flask import request, jsonify, Blueprint
from api.models import db, User, Errand, Favorites

favorite_bp = Blueprint('favorite_custom', __name__, url_prefix='/favorite')



@favorite_bp.route('/errand/<int:errand_id>', methods=['POST'])
def add_favorite(errand_id):
    data_request = request.get_json()
    print(data_request)
    if "users_id" not in data_request:
        return jsonify({"error": "Es obligatorio que en el body del post estén los campos: users_id"}), 400
    errand = Errand.query.get(errand_id)
    print(errand)
    if not errand:
        return jsonify({"error": "No se ha encontrado errand_id"}), 400
    users_id = data_request["users_id"]
    users = User.query.get(users_id)
    print(users)
    if not users:
        return jsonify({"error": "No se ha encontrado users_id"}), 400

    new_favorite = Favorites(
        users_id=users_id,
        errand_id=errand_id
    )

    try:
        db.session.add(new_favorite)
        db.session.commit()
        return jsonify({"message": "Favorite añadido"})
    except Exception as e:
        db.session.rollback()
        print("Error", e)
        return jsonify({"error": "No se ha agregado el favorite"})


@favorite_bp.route('/errand/<int:errand_id>', methods=['DELETE'])
def delete_fav_errand(errand_id):
    favorite = Favorites.query.filter_by(errand_id=errand_id).first()

    if favorite is None:
        return jsonify({"error": "Favorite errand not found"}), 404

    db.session.delete(favorite)
    db.session.commit()

    return jsonify({"message": f"Favorite errand {errand_id} deleted"}), 200

@favorite_bp.route('/user/<int:users_id>/favorites', methods=['GET'])
def get_user_favorites(users_id):
    favorites = Favorites.query.filter_by(users_id=users_id).all()
    if not favorites: 
        return jsonify({"message": "No favorite errands found for this user"}), 404
    serialized_favorites = [favorite.serialize() for favorite in favorites]
    return jsonify(serialized_favorites), 200