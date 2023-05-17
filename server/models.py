from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin

db = SQLAlchemy()

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-_password_hash', '-posts', '-queries',)

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)

    queries = db.relationship('Query', backref='user', lazy=True)
    posts = db.relationship('Post', backref='user', lazy=True)

class Query(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    question = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    @validates('title')
    def validate_title(self, key, title):
        # Add validation logic if needed
        return title

    @validates('question')
    def validate_question(self, key, question):
        # Add validation logic if needed
        return question

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    conversation = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    upvotes = db.Column(db.Integer, default=0)
    downvotes = db.Column(db.Integer, default=0)

    @validates('title')
    def validate_title(self, key, title):
        # Add validation logic if needed
        return title

    @hybrid_property
    def query(self):
        if self.conversation:
            lines = self.conversation.split('\n')
            if len(lines) > 2:
                return lines[1].split(': ', 1)[-1].strip()
        return ''

    @hybrid_property
    def answer(self):
        if self.conversation:
            lines = self.conversation.split('\n')
            if len(lines) > 2:
                return lines[2].split(': ', 1)[-1].strip()
        return ''
