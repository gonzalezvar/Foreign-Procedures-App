from flask import Blueprint, jsonify, request
from api.models.errand import Errand
from api.models import db

errand_bp = Blueprint('errand_custom', __name__, url_prefix='/')

@errand_bp.route('/api/errands', methods=['GET'])
def get_errands():
    errands = Errand.query.all()
    return jsonify([e.serialize_with_relations() for e in errands]), 200

@errand_bp.route('/api/errands', methods=['POST'])
def create_errand():
    data = request.get_json()
    new_errand = Errand(
        name=data['name'],
        procedures=data['procedures'],
        requirements=data['requirements'],
        country=data['country'],
        errand_type_id=data['errand_type_id'],
        office_id=data['office_id']
    )
    db.session.add(new_errand)
    db.session.commit()
    return jsonify(new_errand.serialize()), 201

@errand_bp.route('/api/errands/<int:id>', methods=['PUT'])
def update_errand(id):
    errand = Errand.query.get_or_404(id)
    data = request.get_json()

    errand.name = data.get('name', errand.name)
    errand.procedures = data.get('procedures', errand.procedures)
    errand.requirements = data.get('requirements', errand.requirements)
    errand.country = data.get('country', errand.country)
    errand.errand_type_id = data.get('errand_type_id', errand.errand_type_id)
    errand.office_id = data.get('office_id', errand.office_id)

    db.session.commit()
    return jsonify(errand.serialize()), 200