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
        is_sitter = request.args.get('is_sitter')
        if is_sitter:
            model = Sitter
        else:
            model = Owner

        email = request.args.get('email')
        u = get_one_or_404(model, 'email', email)
        if u:
            if not u.check_password(request.args.get['password']):
                abort(404)
            login_user(u, remember=request.args.get('remember'))
            session['is_sitter'] = True
            response = jsonify(u.to_dict())
            response.status_code = 200
            return response

    form = LoginForm()
    if form.validate_on_submit():
        is_sitter = form.is_sitter.data
        if is_sitter:
            model = Sitter
        else:
            model = Owner

        u = get_one(model, 'first_name', form.username.data)
        if u is None or not u.check_password(form.password.data):
            print("invalid credential")
            return redirect(url_for('main.login'))
        else:
            msg = login_user(u, remember=form.remember.data)
            session['is_sitter'] = True
            print('login', msg)
            return redirect(url_for('main.index'))
    return render_template("login.html", form=form, title=title)


@main_bp.route("/logout")
@login_required
def logout():
    logout_user()
    session.pop('is_sitter')
    if not json_response_needed():
        return redirect(url_for('main.index'))


@main_bp.route('/register', methods=["GET", "POST"])
def register():
    title = "Register an account"
    if json_response_needed():
        # parse request
        is_sitter = request.args.get('is_sitter')

        if is_sitter:
            model = Sitter
        else:
            model = Owner

        email = request.args.get('email')
        u = get_one_or_404(model, 'email', email)
        if u:
            error_response(500, "user exists")
        else:
            u = model(
                first_name=request.args.get('first_name'),
                last_name=request.args.get('last_name'),
                email=request.args.get('email'),
                timestamp=datetime.utcnow()
            )
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
        u = get_one(model, 'first_name', form.first_name.data)
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

@main_bp.route('/user_owner/<username>')
@login_required
def user_owner(username):
    user = get_one(Owner, 'username', username)
    if user:
        return jsonify(user.to_dict())
    return '404'


@main_bp.route('/user_sitter/<username>')
@login_required
def user_sitter(username):
    user = get_one(Sitter, 'username', username)
    if user:
        return jsonify(user.to_dict())
    return '400'
