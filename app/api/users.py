from . import api_bp
from app.models import User, get_one
from flask import jsonify, abort
from app.api.auth import token_auth


@api_bp.route('/users/<username>/', methods=["GET"])
@token_auth.login_required
def get_user(username):
    user = get_one(User, 'username', username)
    if user:
        return jsonify(user.to_dict())
    abort(404)
