from flask import Blueprint, jsonify, request
from api.models.errand_types import Errand_type
from api.models import db

errand_type_bp = Blueprint('errand_types_custom', __name__, url_prefix='/')

@errand_type_bp.route('/api/errand-types', methods=['GET'])
def get_errand_types():
    types = Errand_type.query.all()
    return jsonify([t.serialize() for t in types]), 200

@errand_type_bp.route('/api/errand-types', methods=['POST'])
def create_errand_type():
    data = request.get_json()
    new_type = Errand_type(
        name=data['name'],
        description=data['description']
    )
    db.session.add(new_type)
    db.session.commit()
    return jsonify(new_type.serialize()), 201

@errand_type_bp.route('/api/errand-types/<int:id>', methods=['PUT'])
def update_errand_type(id):
    errand_type = Errand_type.query.get_or_404(id)
    data = request.get_json()
    errand_type.name = data.get('name', errand_type.name)
    errand_type.description = data.get('description', errand_type.description)
    db.session.commit()
    return jsonify(errand_type.serialize()), 200