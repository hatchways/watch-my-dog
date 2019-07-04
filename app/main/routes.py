from flask import render_template, redirect, url_for, jsonify, session, request, abort, g
from datetime import datetime


from . import main_bp
from app.main.forms import LoginForm, RegisterForm
from app.models import get_one, Owner, Sitter, get_one_or_404
from app.errors.handlers import json_response_needed, error_response
from app.api.auth import token_auth
from app.email import send_email
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
    # if current_user.is_anonymous:
    #     print("anonymous")

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
            response = jsonify(user.to_dict())
            response.status_code = 200
            return response
        return error_response(404)

    # if current_user.is_authenticated:
    #     print('current user')
    #     print(current_user.first_name)
    #     return redirect(url_for('main.index'))
    # form = LoginForm()
    # if form.validate_on_submit():
    #     is_sitter = form.is_sitter.data
    #     collection = Sitter if is_sitter else Owner
    #     u = get_one(collection, 'first_name', form.username.data)
    #     if u is None or not u.check_password(form.password.data):
    #         print("invalid credential")
    #         return redirect(url_for('main.login'))
    #     else:
    #         msg = login_user(u, remember=form.remember.data)
    #         # session['is_sitter'] = True
    #         session['is_sitter'] = True if is_sitter else False
    #         print('login', msg)
    #         return redirect(url_for('main.index'))
    # return render_template("login.html", form=form, title=title)


@main_bp.route("/logout")
@token_auth.login_required
def logout():
    g.current_user.revoke_token()
    g.current_user = None
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
        u = get_one_or_404(collection, 'email', email)
        if u:
            error_response(500, "user exists")
        u = collection(
            first_name=request.get_json()['first_name'],
            last_name=request.get_json()['last_name'],
            email=request.get_json()['email'],
            timestamp=datetime.utcnow()
        )
        u.set_password(request.get_json()['password'])
        u.get_token(3600*24*10)
        u.save()
        send_email()
        response = jsonify(u.to_dict())
        response.status_code = 201
        return response

    form = RegisterForm()
    if form.validate_on_submit():
        print('submit')
        is_sitter = form.is_sitter.data
        collection = Sitter if is_sitter else Owner
        u = get_one(collection, 'first_name', form.first_name.data)

        if u:
            print('user exists')
            return redirect(url_for('main.index'))
        u = collection(
            first_name=form.username.data,
            email=form.email.data,
            timestamp=datetime.utcnow()
        )
        u.set_password(form.password.data)
        u.save()
        print('user added')
    #     # flash("Registered successfully!")
        return redirect(url_for('main.index'))
    return render_template("register.html", form=form, title=title)


# flask-pymongo @app.route('/register', methods=["GET", "POST"])
# def register():
#     title = "Register an account"
#     form = RegisterForm()
#     if form.validate_on_submit():
#         print('submit')
#     #     # user = tst_db.users.find_one({'email':form.email.data}) or tst_db.users.find_one({'username':form.username.data})
#         u = _users.find_one({'username':form.username.data})
#         if u:
#             print('user exists')
#             return redirect(url_for('index'))
#         else:
#             u = {
#                 "username": form.username.data,
#                 "email": form.email.data,
#                 "password_hash": generate_password_hash(form.password.data),
#                 "timestamp": datetime.utcnow()
#             }
#
#             _users.insert_one(u)
#             print('user added')
#     #     # flash("Registered successfully!")
#         return redirect(url_for('index'))
#     return render_template("register.html", form=form, title=title)


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


@main_bp.route('/update_profile/', methods=['POST', 'GET'])
@token_auth.login_required
def update_profile():

    profile_data = request.get_json()['profile_data']
    birthdate = profile_data['birthdate']
    gender = profile_data['gender']
    about_me = profile_data['about_me']
    location = profile_data['location']
    charge = profile_data['rate']

    u = g.current_user
    u.birthdate = birthdate
    u.gender = gender
    u.about_me = about_me
    u.location = location
    u.charge = charge
    u.save()

    return jsonify(u.to_dict(include_email=True))
