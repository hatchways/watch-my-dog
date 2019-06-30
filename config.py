import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    SECRET_KEY=os.environ.get('SECRET_KEY') or 'the-mysterious-secret-key'
    MONGO_USERNAME='nwang'
    MONGO_PASSWORD='12345'
    MONGO_URI=os.environ.get("DATABASE_URL") or 'mongodb://localhost:27017/dog-sitting'
    # MONGO_TEST_URI=os.path.join(basedir, 'test.db')
    S3_BUCKET = "lovingsitter"
    S3_KEY= "AKIAJQL6EIPILWCM7K4Q"
    S3_SECRET= "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"
    S3_LOCATION = 'http://{}.s3.ca-central-1.amazonaws.com/'.format(S3_BUCKET)

