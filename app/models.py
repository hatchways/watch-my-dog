from app import login
import os

from flask import current_app, session, abort, g
from flask_login import UserMixin, user_loaded_from_request
from werkzeug.security import check_password_hash, generate_password_hash
from time import time
from datetime import datetime, timedelta
import jwt

from pymodm import MongoModel, fields
from pymongo.write_concern import WriteConcern
from bson.objectid import ObjectId


def get_one(Collection, fieldname, fieldvalue):
    try:
        one = Collection.objects.get({fieldname: fieldvalue})
    except Collection.DoesNotExist:
        print('object not found')
        one = None
    return one


def get_many(Collection, fieldname, fieldvalue):
    try:
        many = list(Collection.objects.raw({fieldname: fieldvalue}))
    except Collection.DoesNotExist:
        print('object not found')
        many = None
    return many


def get_one_or_404(Collection, fieldname, fieldvalue):
    try:
        one = Collection.objects.get({fieldname: fieldvalue})
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

    # token
    def get_token(self, expires_in=3600):
        now = datetime.now()
        if self.token and self.token_expiration > now + timedelta(seconds=3600):
            return self.token
        try:
            payload = {
                'token': self.get_id(),
                'exp': time() + expires_in,
                'time_generated': time()
            }
        except Exception as e:
            return e
        self.token = jwt.encode(payload, current_app.config["SECRET_KEY"],
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
        try:
            payload = jwt.decode(
                token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
            user_id = payload['token']
        except Exception as e:
            return e
        user = get_one(User, '_id', user_id)
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
            'about_me': self.about_me,
            'location': self.location,
            'birthdate': self.birthdate,
            'profile_image': self.profile_image or self.default_url
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


class Sitter(UserMixin, MongoModel):
    default_url = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    password_hash = fields.CharField()
    email = fields.EmailField()
    timestamp = fields.DateTimeField()
    token = fields.CharField()
    token_expiration = fields.DateTimeField()

    first_name = fields.CharField()
    last_name = fields.CharField()
    gender = fields.IntegerField()
    birthdate = fields.CharField()
    about_me = fields.CharField(blank=True)
    charge = fields.FloatField(blank=True)
    location = fields.CharField(blank=True)
    profile_image = fields.CharField(default=default_url, blank=True)

    class Meta:
        write_concern = WriteConcern(j=True)
        connection_alias = 'dog-sitting'

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_id(self):
        return str(self.pk)

    # token
    def get_token(self, expires_in=3600):
        now = datetime.now()
        if self.token and self.token_expiration > now + timedelta(seconds=3600):
            return self.token
        try:
            payload = {
                'token': self.get_id(),
                'exp': time() + expires_in,
                'time_generated': time()
            }
        except Exception as e:
            return e
        self.token = jwt.encode(payload, current_app.config["SECRET_KEY"],
                                algorithm="HS256").decode('utf-8')
        # self.update({"$set": {"token": token }})
        self.token_expiration = now + timedelta(seconds=expires_in)
        # self.update({"$set":{'token_expiration': token_expiration }})
        return self.token

    def revoke_token(self):
        # self.update({"$set":{'token_expiration': datetime.utcnow() - timedelta(seconds=1)}})
        self.token_expiration = datetime.now() - timedelta(seconds=1)

    # #api
    def to_dict(self, include_email=True, include_token=True):
        data = {
            'first_name': self.first_name,
            'last_name': self.last_name,
            'date_registered': self.timestamp,
            'gender': self.gender,
            'about_me': self.about_me,
            'location': self.location,
            'rate': self.charge,
            'birthdate': self.birthdate,
            'profile_image': self.profile_image or self.default_url
        }
        if include_email:
            data['email'] = self.email
        if self.token and include_token:
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
        try:
            payload = jwt.decode(
                token, current_app.config["SECRET_KEY"], algorithm='HS256')
            user_id = payload['token']
        except Exception as e:
            return e
        user = get_one(Sitter, '_id', ObjectId(user_id))
        if user is None or user.token_expiration < datetime.now():
            return None
        return user


class Owner(UserMixin, MongoModel):
    default_url = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    password_hash = fields.CharField()
    email = fields.EmailField()
    timestamp = fields.DateTimeField()
    token = fields.CharField()
    token_expiration = fields.DateTimeField()

    first_name = fields.CharField()
    last_name = fields.CharField()
    gender = fields.IntegerField()
    birthdate = fields.CharField()
    about_me = fields.CharField()
    location = fields.CharField()
    profile_image = fields.CharField(default=default_url, blank=True)

    class Meta:
        write_concern = WriteConcern(j=True)
        connection_alias = 'dog-sitting'

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_id(self):
        return str(self.pk)

    # token
    def get_token(self, expires_in=3600):
        now = datetime.now()
        if self.token and self.token_expiration > now + timedelta(seconds=3600):
            return self.token
        try:
            payload = {
                'token': self.get_id(),
                'exp': time() + expires_in,
                'time_generated': time()
            }
        except Exception as e:
            return e
        print("inside Owner", self.get_id())
        self.token = jwt.encode(payload, current_app.config["SECRET_KEY"],
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
            'location': self.location,
            'birthdate': self.birthdate,
            'profile_image': self.profile_image or self.default_url
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
        try:
            payload = jwt.decode(
                token, current_app.config["SECRET_KEY"], algorithm='HS256')
            user_id = payload['token']
        except Exception as e:
            return e
        user = get_one(Owner, '_id', ObjectId(user_id))
        if user is None or user.token_expiration < datetime.now():
            return None
        return user


class Notification(MongoModel):
    # sent_to = fields.ReferenceField("Sitter, Owner")
    # type_of_notification = fields.IntegerField()
    # is_read = fields.BooleanField()
    pass


class AppointmentRequest(MongoModel):
    created_by = fields.ReferenceField(Owner)
    request_to = fields.ReferenceField(Sitter)
    status = fields.IntegerField()
    timestamp = fields.DateTimeField()
    time_reserved = fields.DateTimeField()
    cancellable = fields.BooleanField()

    def confirm(self):
        pass

    def reject(self):
        pass

    def create_notification(self):
        pass

    def create_reminder(self):
        pass

    def rearrange(self):
        pass

    def cancel(self):
        pass


@user_loaded_from_request.connect
def user_loaded_from_request():
    g.login_via_request = True


# @login.request_loader
# def load_user_from_request(request):
#     if request:
#         print('request', request)
#         for arg in request.args:
#             print('arg', arg)
#         # with token
#         json = request.get_json()
#         if json:
#             is_sitter = json['is_sitter']
#             collection = Sitter if is_sitter else Owner

#             token = json['token']
#             if token:
#                 if is_sitter:
#                     print('search in sitter')
#                 print('search in owner')
#                 user = collection.check_token(token)
#                 print('u_id', ObjectId(user.pk))
#                 return user
#             # with credentials
#             email = json['email']
#             if email:
#                 user = get_one(collection, 'email', email)
#                 return user
#     return None


@login.user_loader
def load_user(u_id):
    print('u_id', ObjectId(u_id))
    if session['is_sitter']:
        print('search in sitter')
        return get_one(Sitter, '_id', ObjectId(u_id))
    print('search in owner')
    return get_one(Owner, '_id', ObjectId(u_id))
