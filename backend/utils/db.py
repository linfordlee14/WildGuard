from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

def init_db(app):
    # Don’t overwrite database URI — app.py already sets it
    db.init_app(app)
    with app.app_context():
        db.create_all()
