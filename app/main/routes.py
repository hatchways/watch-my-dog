from flask import render_template, redirect, url_for, jsonify
from datetime import datetime

from flask_login import current_user, login_user, logout_user, login_required

from . import main_bp
from app.main.forms import LoginForm, RegisterForm
from app.models import User, get_one
from app.api.auth import token_auth

# _users = mongo.db.users


@main_bp.route('/')
@main_bp.route('/index/')
def index():
    return render_template("index.html")


@main_bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        print('current user')
        print(current_user.username)
    if current_user.is_anonymous:
        print("anonymous")
    title="Log in to your account"
    form = LoginForm()
    if form.validate_on_submit():
        try:
            u = User.objects.get({'username':form.username.data})
        except User.DoesNotExist:
            u = None
        if u is None or not u.check_password(form.password.data):
            print("invalid credential")
            return redirect(url_for('main.login'))
        else:
            msg = login_user(u, remember=form.remember.data)
            print(msg)
            return redirect(url_for('main.index'))
    return render_template("login.html", form=form, title=title)


# @app.route('/login', methods=['POST','GET'])
# def login():
#     if current_user.is_authenticated:
#         print('current user')
#         print(current_user.username)
#     if current_user.is_anonymous:
#         print("anonymous")
#     title="Log in to your account"
#     form = LoginForm()
#     if form.validate_on_submit():
#         u = _users.find_one({'username':form.username.data})
#         if u is None or not User.check_password(u['password_hash'], form.password.data):
#             print("invalid credential")
#             return redirect(url_for('login'))
#         else:
#             user = User(username=u['username'], id=u['_id'])
#             msg = login_user(user, remember=form.remember.data)
#             print(msg)
#             return redirect(url_for('index'))
#     return render_template("login.html", form=form, title=title)


@main_bp.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))


@main_bp.route('/register', methods=["GET", "POST"])
def register():
    title = "Register an account"
    form = RegisterForm()
    if form.validate_on_submit():
        print('submit')
        try:
            u = User.objects.get({'username':form.username.data})
        except User.DoesNotExist:
            u = None
        if u:
            print('user exists')
            return redirect(url_for('main.index'))
        else:
            u = User(
                username=form.username.data,
                email=form.email.data,
                timestamp=datetime.utcnow()
            )
            u.set_password(form.password.data)
            u.save()
            print('user added')
    #     # flash("Registered successfully!")
        return redirect(url_for('main.index'))
    return render_template("register.html", form=form, title=title)


# @app.route('/register', methods=["GET", "POST"])
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


@main_bp.route('/users/<username>')
@login_required
def user(username):
    user = get_one(User, 'username', username)
    if user:
        return jsonify(user.to_dict())
    return '404'