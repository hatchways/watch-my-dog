from flask import Flask
from config import Config

from pymodm.connection import connect

# login
from flask import g
from flask.sessions import SecureCookieSessionInterface
from flask_login import LoginManager
login = LoginManager()
login.login_view = 'main.login'

# pymodm mongodb
connect("mongodb://localhost:27017/dog-sitting", alias="dog-sitting")


def create_app(config_class=Config):
    # creating app instance
    # __name__ is a pre-defined variable that contains the name of the module
    app = Flask(__name__)
    app.config.from_object(config_class)

    class CustomSecureCookieSessionInterface(SecureCookieSessionInterface):
        # preventing creating sessions from api requests
        def save_session(self, *args, **kwargs):
            if g.get('login_via_request'):
                return
            return super(CustomSecureCookieSessionInterface, self).save_session(*args, **kwargs)

    app.session_interface = CustomSecureCookieSessionInterface()

    login.init_app(app)

    from app.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

    from app.main import main_bp
    app.register_blueprint(main_bp)

    from app.api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    from app.errors import errors_bp
    app.register_blueprint(errors_bp)

    return app

# flask-pymongo
# mongo = PyMongo(app)

# pymodm
    # pure pymongo
    # client = MongoClient()
    # tst_db = client.test_database



