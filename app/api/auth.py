from flask import g, request
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from app.models import Owner, Sitter, get_one
from .errors import error_response

basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()


@basic_auth.verify_password
def verify_password(email, password):
    is_sitter = request.get_json()['is_sitter']
    collection = Sitter if is_sitter else Owner
    user = get_one(collection, 'email', email)
    if user is None:
        return False
    g.current_user = user
    return user.check_password(password)


@basic_auth.error_handler
def basic_auth_error():
    return error_response(401)


# @basic_auth.verify_password
# def verify_password(email_or_token, password):
#     if email_or_token == '':
#         return False
#     if password == '':
#         user = User.check_token(email_or_token)

#     else:
#         user = get_one(User, 'email', email_or_token)
#         if not user.check_password(password):
#             return False
#
#     if user is None:
#         return False
#     g.current_user = user
#     return user.check_password(password)


@token_auth.verify_token
def verify_token(token):
    g.current_user = Owner.check_token(token) if token else None
    if not g.current_user:
        g.current_user = Sitter.check_token(token) if token else None
    print(g.current_user)
    return g.current_user is not None


@token_auth.error_handler
def token_auth_error():
    return error_response(401)
