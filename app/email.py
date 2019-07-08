from flask_mail import Message
from threading import Thread
from app import mail
from flask import current_app


def send_async_email(app, msg):
    with app.app_context:
        mail.send(msg)


def send_email(subject, sender, recipients, text_body, html_body, attachments=None, async=False):
    msg = Message(subject, sender=sender, recipients=recipients)
    msg.body = text_body
    msg.html = html_body
    if attachments:
        for attachment in attachments:
            msg.attach(*attachment)
    if async:
        Thread(target=send_async_email, args=(current_app._get_current_object(), msg)).start()
    mail.send(msg)

