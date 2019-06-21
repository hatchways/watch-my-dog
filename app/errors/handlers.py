from . import errors_bp
from flask import request
from app.api.errors import error_response


def json_response_needed():
    return request.accept_mimetypes['application/json'] >= \
           request.accept_mimetypes['text/html']


@errors_bp.app_errorhandler(404)
def not_found_error(error):
    if json_response_needed():
        return error_response(404)


@errors_bp.app_errorhandler(500)
def internal_server_error(error):
    if json_response_needed():
        return error_response(500)
