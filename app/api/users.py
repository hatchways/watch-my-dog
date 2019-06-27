from . import api_bp
from app.models import User, get_one, Sitter, Owner
from flask import jsonify, abort, request
from app.api.auth import token_auth
from .errors import error_response


@api_bp.route('/users/<username>/', methods=["GET"])
@token_auth.login_required
def get_user(username):
    user = get_one(User, 'username', username)
    if user:
        return jsonify(user.to_dict())
    abort(404)


@api_bp.route('/edit_profile/<user_id>')
@token_auth.login_required
def edit_profile():
    is_sitter = request.get_json()['is_sitter']
    collection = Sitter if is_sitter else Owner
    token = request.get_json()['token']
    u = collection.check_token(token)
    return jsonify(u.to_dict(include_email=True))


@api_bp.route('/verify/')
@token_auth.login_required
def verify():
    is_sitter = request.get_json()['is_sitter']
    collection = Sitter if is_sitter else Owner
    token = request.get_json()['token']
    user = collection.check_token(token)
    if not user:
        return error_response(401)
    return jsonify(user.to_dict())
