from flask import jsonify
from werkzeug.http import HTTP_STATUS_CODES


def error_response(status_code, error_message=None):
    payload = {'error': HTTP_STATUS_CODES.get(status_code, "Unknown Error")}
    if error_message:
        payload['message'] = error_message
    response = jsonify(payload)
    response.status_code = status_code
    return response


def bad_request(message):
    error_response(400, message)
