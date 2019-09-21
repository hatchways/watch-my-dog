from flask import render_template, redirect, url_for, jsonify, current_app, request, abort, g, send_from_directory
from datetime import datetime
import os


from . import main_bp
from app.main.forms import RegisterForm
from app.models import get_one, Owner, Sitter, get_one_or_404, get_many, Notification, AppointmentRequest
from app.errors.handlers import json_response_needed, error_response
from app.api.auth import token_auth
# email
from app.email import send_email
# objectID search
from bson.objectid import ObjectId
import pymongo
# file upload
import boto3
import botocore
from werkzeug.utils import secure_filename

@main_bp.route('/', defaults={'path': ''})
@main_bp.route('/<path:path>')
def index(path):
    path_dir = os.path.abspath("../../client/build") #path react build
    if path != "" and os.path.exists(os.path.join(path_dir, path)):
        return send_from_directory(os.path.join(path_dir), path)
    else:
        return render_template('index.html')

@main_bp.route('/login', methods=['GET', 'POST'])
def login():
    if json_response_needed():
        # parse request
        is_sitter = request.get_json()['is_sitter']
        collection = Sitter if is_sitter else Owner

        email = request.get_json()['email']
        password = request.get_json()['password']
        user = None

        if email:
            user = get_one(collection, 'email', email)
        if user:
            if not user.check_password(password):
                abort(401)
            token = user.get_token(3600 * 24 * 15)
            user.save()
            data = user.to_dict()
            data['token'] = token
            response = jsonify(data)
            response.status_code = 200
            return response
        return error_response(404)


@main_bp.route("/logout")
@token_auth.login_required
def logout():
    # g.current_user.revoke_token()
    g.current_user = None
    if json_response_needed():
        return '', 200


@main_bp.route('/register', methods=["GET", "POST"])
def register():
    title = "Register an account"
    if json_response_needed():
        # parse request
        is_sitter = request.get_json()['is_sitter']
        collection = Sitter if is_sitter else Owner
        email = request.get_json()['email']
        u = get_one(collection, 'email', email)
        if u:
             return error_response(500, "user exists")
        else:
             u = collection(
                 first_name=request.get_json()['first_name'],
                 last_name=request.get_json()['last_name'],
                 email=request.get_json()['email'],
                 timestamp=datetime.utcnow()
             )
             u.set_password(request.get_json()['password'])
             u.save()
             u.get_token(3600*24*10)
             u.save()
             send_email('Successfully Registered',
                     current_app.config['ADMINS'][0], [u.email], 'Congrats')
             response = jsonify(u.to_dict())
             response.status_code = 201
             return response


@main_bp.route('/search_sitter', methods=['GET', 'POST'])
def get_all_sitters():
    location = request.get_json()['location'].capitalize()
    if location:
        collection = Sitter
        many = get_many(collection, ['location'], [location])
        response = jsonify(
            {"users": [user.to_dict(include_token=False) for user in many]})
        return response, 200
    return error_response(404)


@main_bp.route('/user_owner', methods=['GET', 'POST'])
@token_auth.login_required
def user_owner():
    user = g.current_user
    if user:
        return jsonify(user.to_dict())
    return error_response(404)


@main_bp.route('/user_sitter', methods=['GET', 'POST'])
@token_auth.login_required
def user_sitter():
    user = g.current_user
    if user:
        print(user.to_dict())
        result = user.to_dict()
        return jsonify(result)
    return error_response(404)


@main_bp.route('/make_request')
@token_auth.login_required
def make_appmt_request(user_id, time_reserved):
   current_user = g.current_user
   appmt = AppointmentRequest(
       created_by = current_user,
       request_to = user_id,
       status = 'pending',
       timestamp = datetime.utcnow(),
       time_reserved = time_reserved,
       is_past = False
   )
   appmt.save()
   user = get_one(Sitter, '_id', ObjectId(user_id))
   user.create_rq_notification('Sitter', 'new_request', 'you have '+ user.new_appmt_rqs() + ' new appointment requests')
   send_email('you have '+ user.new_appmt_rqs() + ' new appointment requests', current_app.config['ADMIN'][0], user.email)
   response = jsonify(appmt.to_dict())
   response.status_code = 200
   return response


@main_bp.route('/notifications')
@token_auth.login_required
def view_notifications():
   since = request.args.get('since', 0.0, type=float)
   notifications = get_many(Notification, ['user_collection', 'sent_to', 'type_of_notification', 'timestamp' ], ['Sitter', ObjectId(self.pk), 'new_request', {'$gt': since}])
   notifications = notifications.order_by({'timestamp': pymongo.DESCENDING})
   return jsonify([{
       'type_of_notification': n.type_of_notification,
       'data': n.get_data(),
       'timestamp': n.timestamp
   } for n in notifications])


@main_bp.route('/upload_profile_image', methods=['GET', 'POST'])
@token_auth.login_required
def upload_file():
    file = request.files['file']
    file.filename = secure_filename(file.filename)
    output = upload_file_to_s3(file, current_app.config["S3_BUCKET"])
    user = g.current_user
    user.profile_image = str(output)
    user.save()
    return jsonify(user.to_dict(include_email=True))


def upload_file_to_s3(file, bucket_name, acl="public-read"):
    s3 = boto3.client(
        "s3",
        region_name='ca-central-1',
        aws_access_key_id=current_app.config["S3_KEY"],
        aws_secret_access_key=current_app.config["S3_SECRET"]
    )
    try:
        s3.upload_fileobj(
            file,
            bucket_name,
            file.filename,
            ExtraArgs={
                "ACL": acl,
                "ContentType": file.content_type
            }
        )
    except Exception as e:
        # This is a catch all exception, edit this part to fit your needs.
        print("Something Happened: ", e)
        return e

    return "{}{}".format(current_app.config["S3_LOCATION"], file.filename)


@main_bp.route('/delete_image', methods=['GET', 'POST'])
@token_auth.login_required
def d_file():
    file_name = request.get_json()['file_name']
    if file_name:
        s3 = boto3.client(
            "s3",
            region_name='ca-central-1',
            aws_access_key_id=current_app.config["S3_KEY"],
            aws_secret_access_key=current_app.config["S3_SECRET"]
        )
        output = s3.delete_object(
            Bucket=current_app.config["S3_BUCKET"], Key=file_name)

    u = g.current_user
    u.profile_image = None
    u.save()
    return jsonify(u.to_dict(include_email=True))




# appointment requests
@main_bp.route('/requests', methods=['GET', 'POST'])
@token_auth.login_required
def view_requests():
   is_sitter = request.get_json()['is_sitter']
   current_user = g.current_user
   if is_sitter:
       current_user.last_time_view_requests = datetime.utcnow()
       current_user.create_rq_notification('Sitter', 'new_request', 'you have 0 new appointment requests')
       appmts = get_many(AppointmentRequest, 'request_to', ObjectId(current_user.pk))
   else:
       appmts = get_many(AppointmentRequest, 'created_by', ObjectId(current_user.pk))
   appmts = appmts.order_by({'timestamp': pymongo.DESCENDING})
   appointment_requests = [appmt.to_dict() for appmt in appmts]
   response = jsonify(appointment_requests)
   response.status_code = 200
   return response

