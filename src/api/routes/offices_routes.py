from flask import request, jsonify, Blueprint
from api.models import db, Errand, Offices

offices_bp = Blueprint('office_custom', __name__, url_prefix='/offices')


@offices_bp.route('/', methods=['GET'])
def get_all_offices():
    try:
        all_offices = Offices.query.all()
        result = [office.serialize_with_relations() for office in all_offices]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"message": f"Error retrieving offices: {str(e)}"}), 500


@offices_bp.route('/<int:office_id>', methods=['GET'])
def get_office(office_id):
    try:
        office = Offices.query.get(office_id)
        if office is None:
            return jsonify({"message": "Office not found"}), 404
        return jsonify(office.serialize_with_relations()), 200
    except Exception as e:
        return jsonify({"message": f"Error retrieving office: {str(e)}"}), 500


@offices_bp.route('/', methods=['POST'])
def create_office():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON"}), 400

    if 'office_name' not in data or 'street_name' not in data or 'postal_code' not in data or 'coordinates' not in data:
        return jsonify({"message": "All fields are required"}), 400

    # Extract fields from JSON data
    office_name = data.get('office_name', 'Default Office Name')
    street_name = data.get('street_name')
    postal_code = data.get('postal_code')
    coordinates = data.get('coordinates')

    if not street_name:
        return jsonify({"message": "Street name is required"}), 400

    new_office = Offices(
        office_name=office_name,
        street_name=street_name,
        postal_code=postal_code,
        coordinates=coordinates
    )
    db.session.add(new_office)
    db.session.commit()

    return jsonify(new_office.serialize()), 201


@offices_bp.route('/<int:office_id>', methods=['PUT'])
def update_office(office_id):
    office = Offices.query.get(office_id)

    if office is None:
        return jsonify({"message": "Office not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON"}), 400

    try:
        # Update fields if present in request, otherwise keep current value
        office.office_name = data.get('office_name', office.office_name)
        office.street_name = data.get('street_name', office.street_name)
        office.postal_code = data.get('postal_code', office.postal_code)
        office.coordinates = data.get('coordinates', office.coordinates)

        db.session.commit()
        return jsonify(office.serialize()), 200
    except Exception as e:
        db.session.rollback()  # Revert changes on error
        return jsonify({"message": f"Error updating office: {str(e)}"}), 500


@offices_bp.route('/<int:office_id>', methods=['DELETE'])
def delete_office(office_id):
    try:
        office = Offices.query.get(office_id)
        if office is None:
            return jsonify({"message": "Office not found"}), 404

        db.session.delete(office)
        db.session.commit()
        return jsonify({"message": "Office deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()  # Revert changes on error
        return jsonify({"message": f"Error deleting office: {str(e)}"}), 500
