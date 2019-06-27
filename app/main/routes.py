from flask import render_template, redirect, url_for, jsonify, session, request, abort
from datetime import datetime

from flask_login import current_user, login_user, logout_user, login_required

from . import main_bp
from app.main.forms import LoginForm, RegisterForm
from app.models import get_one, Owner, Sitter, get_one_or_404
from app.errors.handlers import json_response_needed, error_response

# _users = mongo.db.users


@main_bp.route('/')
@main_bp.route('/index/')
def index():
    return render_template('index.html')


@main_bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        print('current user')
        print(current_user.first_name)
    if current_user.is_anonymous:
        print("anonymous")
    title = "log in as a dog sitter"
    if json_response_needed():
        # parse request
        is_sitter = request.get_json()['is_sitter']
        if is_sitter:
            model = Sitter
        else:
            model = Owner
        
        email = request.get_json()['email']
        print(email)
        u = get_one(model, 'email', email)
        if u:
            if not u.check_password(request.get_json()['password']):
                abort(404)
            login_user(u, remember=request.get_json()['remember'])
            session['is_sitter'] = True if is_sitter else False
            response = jsonify(u.to_dict())
            response.status_code = 200
            return response

    # form = LoginForm()
    # if form.validate_on_submit():
    #     is_sitter = form.is_sitter.data
    #     if is_sitter:
    #         model = Sitter
    #     else:
    #         model = Owner

    #     u = get_one(model, 'first_name', form.username.data)
    #     if u is None or not u.check_password(form.password.data):
    #         print("invalid credential")
    #         return redirect(url_for('main.login'))
    #     else:
    #         msg = login_user(u, remember=form.remember.data)
    #         session['is_sitter'] = True if is_sitter else False
    #         print('login', msg)
    #         return redirect(url_for('main.index'))
    # return render_template("login.html", form=form, title=title)


@main_bp.route("/logout")
@login_required
def logout():
    logout_user()
    session.pop('is_sitter')
    if not json_response_needed():
        return redirect(url_for('main.index'))
    return "", 302



@main_bp.route('/register', methods=["GET", "POST"])
def register():
    title = "Register an account"
    if json_response_needed():
        # parse request
        is_sitter = request.get_json()['is_sitter']

        if is_sitter:
            model = Sitter
        else:
            model = Owner

        email = request.get_json()['email']
        print('content',email)
        u = get_one(model, 'email', email)

        if u:
            error_response(500, "user exists")
        else:
            u = model(
                first_name=request.get_json()['first_name'],
                last_name=request.get_json()['last_name'],
                email=request.get_json()['email'],
                timestamp=datetime.utcnow()
            )
            u.set_password(request.get_json()['password'])
            u.get_token(3600*24*10)
            u.save()
            response = jsonify(u.to_dict())
            response.status_code = 201
            return response

    form = RegisterForm()
    if form.validate_on_submit():
        print('submit')
        is_sitter = form.is_sitter.data
        if is_sitter:
            model = Sitter
        else:
            model = Owner
        u = get_one(model, 'first_name', form.username.data)
        if u:
            print('user exists')
            return redirect(url_for('main.index'))
        else:
            u = model(
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
def user_owner():
    token = request.get_json()['token']
    user = get_one(Owner, 'token', token)
    print(user.token)
    if user:
        return jsonify(user.to_dict())
    return '404'


@main_bp.route('/user_sitter', methods=['GET', 'POST'])
def user_sitter():
    token = request.get_json()['token']
    user = get_one(Sitter, 'token', token)
    print(user.token)
    if user:
        return jsonify(user.to_dict())
    return '404'
