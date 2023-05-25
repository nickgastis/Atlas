from app import app
from models import db, User, Query, Post

def deletePost():
    Post.query.delete()

    db.session.commit()


if __name__ == '__main__':
    with app.app_context():
        deletePost()