from flask import g, jsonify
from app.api import api_bp
from app.api.auth import basic_auth, token_auth


@api_bp.route('/tokens/', methods=['POST'])
@basic_auth.login_required
def get_token():
    token = g.current_user.get_token()
    g.current_user.save()
    return jsonify({'token':token})


@api_bp.route('/tokens/', methods=['DELETE'])
@token_auth.login_required
def revoke_token():
    g.current_user.revoke_token()
    g.current_user.save()
    return '', 204


@api_bp.route('/gen_token/', methods=['GET'])
@basic_auth.login_required
def api_gen_token():
    token = g.current_user.get_token()
    g.current_user.save()
    return jsonify({'token':token})