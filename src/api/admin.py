import os
from flask_admin import Admin
from api.models import db, User, Errand, Errand_type, Favorites, Offices, Follow_up
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Errand, db.session))
    admin.add_view(ModelView(Errand_type, db.session))
    admin.add_view(ModelView(Favorites, db.session))
    admin.add_view(ModelView(Offices, db.session))
    admin.add_view(ModelView(Follow_up, db.session))
    
