import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    SECRET_KEY=os.environ.get('SECRET_KEY') or 'the-mysterious-secret-key'
    MONGO_USERNAME='nwang'
    MONGO_PASSWORD='12345'
    MONGO_URI=os.environ.get("DATABASE_URL") or 'mongodb://localhost:27017/dog-sitting'
    # MONGO_TEST_URI=os.path.join(basedir, 'test.db')
    S3_BUCKET = "lovingsitter"
    S3_KEY= "AKIAIUU3TZNMQO2VTBWA"
    S3_SECRET= "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"
    S3_LOCATION = 'http://{}.s3.ca-central-1.amazonaws.com/'.format(S3_BUCKET)

