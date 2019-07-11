import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    SECRET_KEY=os.environ.get('SECRET_KEY') or 'the-mysterious-secret-key'
    MONGO_USERNAME='nwang'
    MONGO_PASSWORD='12345'
    MONGO_URI=os.environ.get("DATABASE_URL") or 'mongodb://localhost:27017/dog-sitting'
    # MONGO_TEST_URI=os.path.join(basedir, 'test.db')
    MAIL_SERVER = 'smtp.googlemail.com'
    MAIL_PORT = 465
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    ADMINS = ['teamlowry2019@gmail.com']
    S3_BUCKET                 = os.environ.get("S3_BUCKET_NAME")
    S3_KEY                    = os.environ.get("S3_ACCESS_KEY")
    S3_SECRET                 = os.environ.get("S3_SECRET_ACCESS_KEY")
    S3_LOCATION               = 'http://{}.s3.amazonaws.com/'.format(S3_BUCKET)

