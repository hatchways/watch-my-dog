from flask_wtf import FlaskForm
from wtforms import BooleanField, SubmitField, StringField, PasswordField
from wtforms.validators import DataRequired, EqualTo


class LoginForm(FlaskForm):
    username = StringField("username")
    email = StringField("email", validators=[DataRequired()])
    password = PasswordField("password", validators=[DataRequired()])
    remember = BooleanField('Remember Me')
    is_sitter = BooleanField('log in as a dog sitter?')
    submit = SubmitField("Sign In")


class RegisterForm(FlaskForm):
    username = StringField("username")
    email = StringField("email", validators=[DataRequired()])
    password = PasswordField("password", validators=[DataRequired()])
    password2 = PasswordField("password2", validators=[DataRequired(), EqualTo('password')])
    is_sitter = BooleanField('Become a dog sitter?')
    submit = SubmitField("Register")
