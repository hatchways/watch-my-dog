from app import login

from flask import current_app, session, abort
from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash
from time import time
from datetime import datetime, timedelta
import jwt

from pymodm import MongoModel, fields
from pymongo.write_concern import WriteConcern
from bson.objectid import ObjectId


# class User(UserMixin):
#     def __init__(self, username, id):
#         self.username = username
#         self.id = id
#         # self.password_hash = password_hash
#         # self.email = email
#
#     @staticmethod
#     def check_password(password_hash, password):
#         return check_password_hash(password_hash, password)


# @login.user_loader
# def load_user(u_id):
#     u = mongo.db.users.find_one({u'_id': u_id})
#     print('iiiii')
#     print(u_id)
#     if u is None:
#         print('u is none')
    #     return None
    # return User(id=u_id, username=u['username'])


def get_one(Collection, fieldname, fieldvalue):
    try:
        one = Collection.objects.get({fieldname: fieldvalue})
        print(fieldname, one.first_name)
    except Collection.DoesNotExist:
        print('notfound')
        one = None
    return one


def get_one_or_404(Collection, fieldname, fieldvalue):
    try:
        one = Collection.objects.get({fieldname:fieldvalue})
        print(fieldname, one.first_name)
    except Collection.DoesNotExist:
        abort(404)
    return one


class User(UserMixin, MongoModel):
    password_hash = fields.CharField()
    email = fields.EmailField()
    timestamp = fields.DateTimeField()
    token = fields.CharField()
    token_expiration = fields.DateTimeField()

    first_name = fields.CharField()
    last_name = fields.CharField()
    gender = fields.IntegerField()

    about_me = fields.CharField()

    class Meta:
        write_concern = WriteConcern(j=True)
        connection_alias = 'dog-sitting'

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_id(self):
        return str(self.pk)

    #token
    def get_token(self, expires_in=3600):
        now = datetime.now()
        if self.token and self.token_expiration > now + timedelta(seconds=3600):
            return self.token
        self.token = jwt.encode({'token': self.username, 'exp': time() + expires_in},
                                 current_app.config["SECRET_KEY"],
                                algorithm="HS256").decode('utf-8')
        # self.update({"$set": {"token": token }})
        self.token_expiration = now + timedelta(seconds=expires_in)
        # self.update({"$set":{'token_expiration': token_expiration }})
        return self.token

    def revoke_token(self):
        # self.update({"$set":{'token_expiration': datetime.utcnow() - timedelta(seconds=1)}})
        self.token_expiration = datetime.now() - timedelta(seconds=1)

    @staticmethod
    def check_token(token):
        user = get_one(User, 'token', token)
        print('exp', user.token_expiration)
        print("now", datetime.now())
        if user is None or user.token_expiration < datetime.now():
            return None
        return user

    # #api
    def to_dict(self, include_email=True):
        data = {
            'first_name': self.first_name,
            'last_name': self.last_name,
            'date_registered': self.timestamp,
            'gender': self.gender,
            'about_me': self.about_me
        }
        if include_email:
            data['email'] = self.email
        return data

    def from_dict(self, data, new_user=False):
        for field in ['first_name', 'last_name', 'email', 'date_registered',
                      'gender', 'about_me']:
            if field in data:
                setattr(self, field, data[field])
            if new_user and 'password' in data:
                self.set_password(data['password'])


class Sitter(UserMixin, MongoModel):
    password_hash = fields.CharField()
    email = fields.EmailField()
    timestamp = fields.DateTimeField()
    token = fields.CharField()
    token_expiration = fields.DateTimeField()

    first_name = fields.CharField()
    last_name = fields.CharField()
    gender = fields.IntegerField()

    about_me = fields.CharField()

    charge = fields.FloatField()

    class Meta:
        write_concern = WriteConcern(j=True)
        connection_alias = 'dog-sitting'

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_id(self):
        return str(self.pk)

    #token
    def get_token(self, expires_in=3600):
        now = datetime.now()
        if self.token and self.token_expiration > now + timedelta(seconds=3600):
            return self.token
        self.token = jwt.encode({'token': self.email, 'exp': time() + expires_in},
                                 current_app.config["SECRET_KEY"],
                                algorithm="HS256").decode('utf-8')
        # self.update({"$set": {"token": token }})
        self.token_expiration = now + timedelta(seconds=expires_in)
        # self.update({"$set":{'token_expiration': token_expiration }})
        return self.token

    def revoke_token(self):
        # self.update({"$set":{'token_expiration': datetime.utcnow() - timedelta(seconds=1)}})
        self.token_expiration = datetime.now() - timedelta(seconds=1)

    # #api
    def to_dict(self, include_email=True):
        data = {
            'first_name': self.first_name,
            'last_name': self.last_name,
            'date_registered': self.timestamp,
            'gender': self.gender,
            'about_me': self.about_me,  
        }
        if include_email:
            data['email'] = self.email
        if self.token:
            data['token'] = self.token
        return data

    def from_dict(self, data, new_user=False):
        for field in ['first_name', 'last_name', 'email', 'date_registered',
                      'gender', 'about_me']:
            if field in data:
                setattr(self, field, data[field])
            if new_user and 'password' in data:
                self.set_password(data['password'])


    @staticmethod
    def check_token(token):
        user = get_one(Sitter, 'token', token)
        print('exp', user.token_expiration)
        print("now", datetime.now())
        if user is None or user.token_expiration < datetime.now():
            return None
        return user



class Owner(UserMixin, MongoModel):
    password_hash = fields.CharField()
    email = fields.EmailField()
    timestamp = fields.DateTimeField()
    token = fields.CharField()
    token_expiration = fields.DateTimeField()

    first_name = fields.CharField()
    last_name = fields.CharField()
    gender = fields.IntegerField()

    about_me = fields.CharField()

    charge = fields.FloatField()

    class Meta:
        write_concern = WriteConcern(j=True)
        connection_alias = 'dog-sitting'

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_id(self):
        return str(self.pk)

    #token
    def get_token(self, expires_in=3600):
        now = datetime.now()
        if self.token and self.token_expiration > now + timedelta(seconds=3600):
            return self.token
        self.token = jwt.encode({'token': self.email, 'exp': time() + expires_in},
                                 current_app.config["SECRET_KEY"],
                                algorithm="HS256").decode('utf-8')
        # self.update({"$set": {"token": token }})
        self.token_expiration = now + timedelta(seconds=expires_in)
        # self.update({"$set":{'token_expiration': token_expiration }})
        return self.token

    def revoke_token(self):
        # self.update({"$set":{'token_expiration': datetime.utcnow() - timedelta(seconds=1)}})
        self.token_expiration = datetime.now() - timedelta(seconds=1)

    # #api
    def to_dict(self, include_email=True):
        data = {
            'first_name': self.first_name,
            'last_name': self.last_name,
            'date_registered': self.timestamp,
            'gender': self.gender,
            'about_me': self.about_me
        }
        if include_email:
            data['email'] = self.email
        if self.token:
            data['token'] = self.token
        return data

    def from_dict(self, data, new_user=False):
        for field in ['first_name', 'last_name', 'email', 'date_registered',
                      'gender', 'about_me']:
            if field in data:
                setattr(self, field, data[field])
            if new_user and 'password' in data:
                self.set_password(data['password'])

    @staticmethod
    def check_token(token):
        user = get_one(Owner, 'token', token)
        print('exp', user.token_expiration)
        print("now", datetime.now())
        if user is None or user.token_expiration < datetime.now():
            return None
        return user


@login.user_loader
def load_user(u_id):
    print('u_id', ObjectId(u_id))
    print(session)
    if session['is_sitter']:
        print('search in sitter')
        return get_one(Sitter,'_id', ObjectId(u_id))
    print('search in owner')
    return get_one(Owner,'_id', ObjectId(u_id))
