from flask import Blueprint, jsonify, request
from api.models import db, User
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from datetime import timedelta
from extensions import mail
from flask_mail import Message
import os

user_bp = Blueprint(
    'user_custom', __name__)

CORS(user_bp)

bcrypt = Bcrypt()


@user_bp.route('/users_info', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([e.serialize_with_relations() for e in users]), 200


@user_bp.route('/home', methods=['GET'])
@jwt_required()
def private_route():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    response_body = {
        "message": f"Hola {user.email}, soy una ruta privada"
    }

    return jsonify(response_body), 200


@user_bp.route('/user/actualization', methods=['GET'])
@jwt_required()
def get_user_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user:
        return jsonify(user.serialize_with_relations()), 200
    else:
        return jsonify({"message": "Usuario no encontrado"}), 404


@user_bp.route('/user/login', methods=["POST"])
def sing_in():
    data_request = request.get_json()

    if not 'email' in data_request or not 'password' in data_request:
        return jsonify({"error": "Los campos: email,password son requeridos"}), 400

    user = User.query.filter_by(email=data_request["email"]).first()

    if not user or not bcrypt.check_password_hash(user.password, data_request["password"]):
        return jsonify({"msg": "El email o la contraseña es incorrecto"}), 401

    try:
        access_token = create_access_token(identity=str(user.users_id))
        return jsonify({
            "token": access_token,
            "user": user.serialize_with_relations()
        }), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error en el servido"}), 500


@user_bp.route('/user/create', methods=["POST"])
def create_user():
    data_request = request.get_json()

    if not 'email' in data_request or not 'password' in data_request:
        return jsonify({"error": "Los campos: email,password son requeridos"}), 400

    new_user = User(
        email=data_request["email"],
        password=bcrypt.generate_password_hash(
            data_request["password"]).decode('utf-8')
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg": "Se creo el usuario"}), 201
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error en el servido"}), 500

# Recuperar contraseña


@user_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data_request = request.get_json()
    email = data_request.get('email')
    if not email:
        return jsonify({"message": "El email es necesario"}), 404
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "Si la dirección correo electrónico es correcta, recibirás un correo de recuperación"})
    claims = {"forgot_password": True, "email": email}
    reset_token = create_access_token(identity=str(user.users_id),
                                      expires_delta=timedelta(minutes=15),
                                      additional_claims=claims)

# Envío del correo tras petición de recuperación de contraseña
    try:
        # Agrego para que sea más versatil de usar. Declaro link también
        # link = os.getenv("VITE_BACKEND_URL")
        # reset_url = f"{link}?token={reset_token}"
        reset_url = f"http://localhost:3001?token={reset_token}"
        msg = Message('Restablece tú contraseña',
                      recipients=[email, "celfinalproject@gmail.com"],
                      html=f"""<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Recuperación de contraseña</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
      <table width="100%" bgcolor="#f4f4f4" cellpadding="0" cellspacing="0" style="padding: 20px 0;">
        <tr>
          <td align="center">
            <table width="600" bgcolor="#ffffff" cellpadding="40" cellspacing="0" style="border-radius: 8px;">
              <tr>
                <td align="center" style="font-size: 24px; font-weight: bold; color: #333;">
                  <img src="https://tusitio.com/static/img/Logo2.png" alt="Logo página" style="width: 150px; height: 150px;">
                  <br><br>
                  Recuperación de Contraseña
                </td>
              </tr>
              <tr>
                <td style="font-size: 16px; color: #555;">
                  Hola, hemos recibido una solicitud para restablecer tu contraseña. Si tú no hiciste esta solicitud, puedes ignorar este correo.
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 30px 0;">
                  <a href="{reset_url}" 
                     style="background-color: #007BFF; color: #ffffff; padding: 14px 28px; text-decoration: none; font-size: 16px; border-radius: 6px; display: inline-block;">
                    Restablecer Contraseña
                  </a>
                </td>
              </tr>
              <tr>
                <td style="font-size: 14px; color: #999;">
                  Este enlace expirará en 15 minutos por motivos de seguridad.
                </td>
              </tr>
              <tr>
                <td style="font-size: 12px; color: #ccc; padding-top: 20px;">
                  © 2025 Mi Aplicación. Proyecto final CEL.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>""")

        mail.send(msg)
        return jsonify({"message": "Email enviado"}), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "Error en el servidor, intenta más tarde"})


@user_bp.route('/reset-password', methods=["POST"])
@jwt_required()
def reset_password():
    data_request = request.get_json()
    # generamos el hash en password que el usuario indique para cambiar la contraseña
    new_password = bcrypt.generate_password_hash(
        data_request.get("password")).decode('utf-8')
    if not new_password:
        return jsonify({"message": "La contraseña es obligatoria"})

    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        claims = get_jwt()

        if claims.get("forgot_password") and claims.get("email") == user.email:
            user.password = new_password
            db.session.commit()
            return jsonify({"message": "Contraseña restablecida"})
        else:
            return jsonify({"message": "Error en la validación de los datos, contacta al administrador"})
    except Exception as e:
        print(e)
        return jsonify({"message": "Error en el servidor, intenta más tarde"})
