from . import api_bp
from app.models import User, get_one, Sitter, Owner
from flask import jsonify, abort, request
from app.api.auth import token_auth
from .errors import error_response


@api_bp.route('/users', methods=["GET", "POST"])
@token_auth.login_required
def get_user(username):
    user = get_one(User, 'username', username)
    if user:
        return jsonify(user.to_dict())
    abort(404)


@api_bp.route('/update_profile/', methods=["GET", "POST"])
@token_auth.login_required
def update_profile():
   is_sitter = request.get_json()['is_sitter']
   collection = Sitter if is_sitter else Owner
   profile_data = request.get_json()['profile_data']
   birthdate = profile_data['birthdate']
   gender = profile_data['gender']
   about_me = profile_data['about_me']
   location = profile_data['location']
   token = request.get_json()['token']

   u = collection.check_token(token)
   u.birthdate = birthdate
   u.gender = gender
   u.about_me = about_me
   u.location = location
   if is_sitter:
    charge = profile_data['rate'] 
    u.charge = charge
   u.save()
   return jsonify(u.to_dict(include_email=True))


@api_bp.route('/verify' , methods=["GET", "POST"])
@token_auth.login_required
def verify():
    is_sitter = request.get_json()['is_sitter']
    collection = Sitter if is_sitter else Owner
    token = request.get_json()['token']
    user = collection.check_token(token)
    if not user:
        return error_response(401)
    return jsonify(user.to_dict())
