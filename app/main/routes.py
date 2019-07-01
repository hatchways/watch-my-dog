from flask import current_app, render_template, redirect, url_for, jsonify, session, request, abort, g
from datetime import datetime

from flask_login import current_user, login_user, logout_user, login_required

from . import main_bp
from app.main.forms import LoginForm, RegisterForm
from app.models import get_one, Owner, Sitter, get_one_or_404
from app.errors.handlers import json_response_needed, error_response
from app.api.auth import token_auth
import boto3, botocore
from werkzeug.utils import secure_filename
# _users = mongo.db.users


@main_bp.route('/')
@main_bp.route('/index/')
def index():
    if json_response_needed():
        token = request.get_json()['token']
        is_sitter = request.get_json()['is_sitter']
        collection = Sitter if is_sitter else Owner
        if token:
            u = collection.check_token(token)
            return jsonify(u.to_dict())
        else:
            return '', 200
    return render_template('index.html')


@main_bp.route('/login', methods=['GET', 'POST'])
def login():
    title = "log in as a dog sitter"
    if json_response_needed():
        # parse request
        is_sitter = request.get_json()['is_sitter']
        collection = Sitter if is_sitter else Owner

        email = request.get_json()['email']
        password = request.get_json()['password']


        if email:
            user = get_one(collection, 'email', email)
        if user:
            if not user.check_password(password):
                abort(401)
            login_user(user)
            response = jsonify(user.to_dict())

            response.status_code = 200
            return response
        return error_response(404)



@main_bp.route("/logout")
@login_required
def logout():
    logout_user()
    if json_response_needed():
        return '', 200
    return redirect(url_for('main.index'))



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
            error_response(500, "user exists")
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
        response = jsonify(u.to_dict())
        response.status_code = 201
        return response


@main_bp.route('/user_owner', methods=['GET', 'POST'])
@token_auth.login_required
def user_owner():
    token = request.get_json()['token']
    user = get_one(Owner, 'token', token)
    if user:
        return jsonify(user.to_dict())
    return error_response(404)


@main_bp.route('/user_sitter', methods=['GET', 'POST'])
@token_auth.login_required
def user_sitter():
    token = request.get_json()['token']
    user = get_one(Sitter, 'token', token)
    if user:
        return jsonify(user.to_dict())
    return error_response(404)





@main_bp.route('/upload_profile_image', methods=['GET', 'POST'])
@token_auth.login_required
def upload_file():
    file = request.files['file']
    file.filename = secure_filename(file.filename)
    output   	  = upload_file_to_s3(file, current_app.config["S3_BUCKET"])
    token = request.headers['Authorization'].split(" ")[1]
    collection = Sitter if Sitter.check_token(token) else Owner
    u = collection.check_token(token)
    u.profile_image = str(output)
    u.save()
    return jsonify(u.to_dict(include_email=True))


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
    print("length",file_name)
    if file_name:
        s3 = boto3.client(
            "s3",
            region_name='ca-central-1',
            aws_access_key_id=current_app.config["S3_KEY"],
            aws_secret_access_key=current_app.config["S3_SECRET"]
        )
        output = s3.delete_object(Bucket=current_app.config["S3_BUCKET"], Key=file_name)
        
    token = request.get_json()['token']
    collection = Sitter if Sitter.check_token(token) else Owner
    u = collection.check_token(token)
    u.profile_image = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    u.save()
    return jsonify(u.to_dict(include_email=True))
