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


# def get_many(Collection, fieldname, fieldvalue):
#     try:
#         many = list(Collection.objects.raw({fieldname: fieldvalue}))
#     except Collection.DoesNotExist:
#         print('object not found')
#         many = None
#     return many


def get_one_or_404(Collection, fieldname, fieldvalue):
    try:
        one = Collection.objects.get({fieldname: fieldvalue})
    except Collection.DoesNotExist:
        abort(404)
    return one


def get_many(Collection, fieldnames, fieldvalues):
   try:
       filter = {}
       for i in range(len(fieldnames)):
           filter[fieldnames[i]] = fieldvalues[i]
       many = Collection.objects.raw(filter)
   except Collection.DoesNotExist:
       print('object not found')
       many = None
   return many


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

    # notification
    last_time_view_requests = fields.DateTimeField()

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
        print(jwt.file)
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
        if include_token:
            data['token'] = self.get_token()
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

    def new_appmt_rqs(self):
        last_time_viewed = self.last_time_view_requests or datetime(2010, 8, 10)
        return get_many(AppointmentRequest, ['request_to', 'timestamp'], [ObjectId(self.pk), {'$gte': last_time_viewed}]).\
            count()


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
    def to_dict(self, include_email=True, include_token=True):
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
        if include_token:
            data['token'] = self.get_token()
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
    sent_to = fields.ReferenceField("Sitter, Owner")
    type_of_notification = fields.IntegerField()
    # is_read = fields.BooleanField()
    pass


class AppointmentRequest(MongoModel):
    created_by = fields.ReferenceField(Owner)
    request_to = fields.ReferenceField(Sitter)
    status = fields.IntegerField()
    timestamp = fields.DateTimeField()
    time_reserved = fields.DateTimeField()
    is_past = fields.BooleanField()

    # #api
    def to_dict(self):
        data = {
            'created_by': self.created_by,
            'request_to': self.request_to,
            'status': self.status,
            'timestamp': self.timestamp,
            'time_reserved': self.time_reserved,
            'is_past': self.is_past
        }

    def rearrange(self, new_time=None):
        self.status = 0 # pending
        if new_time:
            self.time_reserved = new_time

    def confirm(self):
        if self.status:
            self.status = 0
        self.status = 1

    def reject(self):
        if self.status:
            self.status = 0
        self.status = 2

    def is_cancellable(self):
        return self.time_reserved > datetime.utcnow()

    def cancel(self):
        # from user's side
        if self.is_cancellable():
            self.delete()
            return True
        return False

    def finish(self):
        self.is_past = True

    def create_notification(self):
        pass

    def create_reminder(self):
        pass


@user_loaded_from_request.connect
def user_loaded_from_request():
    g.login_via_request = True
    