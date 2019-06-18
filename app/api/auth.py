from flask import g
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from app.models import User, get_one
from flask_login import current_user

basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()


@basic_auth.verify_password
def verify_password(username, password):
    user = get_one(User, 'username', username)
    if user is None:
        return False
    g.current_user = user
    return user.check_password(password)


@token_auth.verify_token
def verify_token(token):
    g.current_user = User.check_token(token) if token else None
    print(g.current_user)
    return g.current_user is not None


