import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from dotenv import load_dotenv
from extensions import mail
from api.commands import setup_commands
from api.admin import setup_admin
from api.models import db, Errand, Errand_type, Favorites, Offices, Follow_up, User
from api.routes import errand_bp, errand_type_bp, favorite_bp, follow_up_bp, offices_bp, user_bp, api
from api.utils import *
from datetime import timedelta

load_dotenv()

# Environment setup
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')

# Flask app setup
app = Flask(__name__)
app.url_map.strict_slashes = False

# Extensions
jwt = JWTManager(app)
mail.init_app(app)
CORS(app)

app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=3)


# Blueprints registration
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(errand_type_bp, url_prefix='/api')
app.register_blueprint(errand_bp, url_prefix='/api')
app.register_blueprint(favorite_bp, url_prefix='/api')
app.register_blueprint(offices_bp, url_prefix='/api')
app.register_blueprint(follow_up_bp, url_prefix='/api')
app.register_blueprint(api, url_prefix='/api')

# Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = os.getenv("MAIL_SENDER")
app.config['MAIL_PASSWORD'] = os.getenv("APP_MAIL_KEY")
app.config['MAIL_DEFAULT_SENDER'] = os.getenv("MAIL_SENDER")

db_url = os.getenv("DATABASE_URL")
if db_url:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

setup_admin(app)
setup_commands(app)

@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  
    return response


if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
