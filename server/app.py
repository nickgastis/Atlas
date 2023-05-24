from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from models import db, User, Query, Post
from flask import request, make_response, abort, jsonify, render_template, session
import os
from dotenv import load_dotenv
from flask_migrate import Migrate
load_dotenv('../.env.local')
from flask_login import LoginManager, login_user, current_user, login_required
# from sqlalchemy import MetaData, desc, asc, CheckConstraint, or_
# from flask_sqlalchemy import SQLAlchemy



app = Flask(
    __name__,
    static_url_path='',
    static_folder='../client/build',
    template_folder='../client/build'
            )
app.secret_key = os.environ.get('APP_SECRET_KEY')
login_manager = LoginManager(app)
login_manager.login_view = 'login'

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('EXTERNAL_DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False



# metadata = MetaData(naming_convention={
#     "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
# })
# db = SQLAlchemy(metadata=metadata)

migrate = Migrate(app, db)

db.init_app(app)
api = Api(app)


@app.route('/')
@app.route('/<int:id>')
def index(id=0):
    return render_template("index.html")


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))





@app.route('/auth/callback', methods=['POST'])
def auth_callback():
    data = request.json
    
    username = data['username']
    email = data['email']
    auth0_id = data['sub']

    user = User.query.filter_by(email=email).first()

    if user:
        login_user(user) 
        print("user logged in ")
        return jsonify({'message': 'User already exists'})

    new_user = User(username=username, email=email, auth0_id=auth0_id)
    db.session.add(new_user)
    db.session.commit()
    print("user logged in successfully")
    login_user(new_user)

    return jsonify({'message': 'User created and logged in successfully'})




from flask_login import current_user, login_required

@app.route('/current_user', methods=['GET'])
@login_required
def get_current_user():
    user_id = session.get('_user_id')
    print(session)

    if user_id:
        user = User.query.get(user_id)
        if user:
            return {
                'username': user.username,
                'email': user.email,
                'auth0_id': user.auth0_id,
                'user_id': user.id
            }
        else:
            return {'message': 'User not found'}, 404

    return {'message': 'Unauthorized'}, 401




@app.route('/current_user', methods=['DELETE'])
@login_required
def delete_current_user():
    user_id = session.get('_user_id')

    if user_id:
        user = User.query.get(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return {'message': 'User deleted successfully'}
        else:
            return {'message': 'User not found'}, 404

    return {'message': 'Unauthorized'}, 401







@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    title = data.get('title')
    conversation = str(data.get('conversation'))  # Convert to string
    username = data.get('username')
    
    
    user_id = data.get('user_id')
    new_post = Post(title=title, conversation=conversation, user_id=user_id, username=username)

    db.session.add(new_post)
    db.session.commit()

    return jsonify(message='Post created successfully'), 201





from flask import jsonify

@app.route('/posts', methods=['GET'])
def get_all_posts():
    posts = Post.query.order_by(Post.upvotes.desc()).all()
    
    serialized_posts = []
    for post in posts:
        serialized_post = {
            'id': post.id,
            'title': post.title,
            'conversation': post.conversation,
            'user_id': post.user_id,
            'upvotes': post.upvotes,
            'downvotes': post.downvotes
        }
        serialized_posts.append(serialized_post)
    
    return jsonify(serialized_posts)

# from flask_restful import Resource








class UsersById(Resource):
    def get(self, user_id):
        user = User.query.get(user_id)
        if user:
            return {
                'id': user.id,
                'username': user.username,
            }
        else:
            return {'message': 'User not found'}, 404


    def post(self):
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')

        user = User(username=username, email=email)
        db.session.add(user)
        db.session.commit()

        return {'message': 'User created successfully'}, 201


class QueryResource(Resource):
    def get(self, query_id):
        query = Query.query.get(query_id)
        if query:
            return {
                'id': query.id,
                'title': query.title,
                'conversation': query.conversation,
                'user_id': query.user_id
            }
        else:
            return {'message': 'Query not found'}, 404


    def post(self):
        data = request.get_json()
        title = data.get('title')
        conversation = data.get('conversation')
        user_id = data.get('user_id')

        query = Query(title=title, conversation=conversation, user_id=user_id)
        db.session.add(query)
        db.session.commit()

        return {'message': 'Query created successfully'}, 201



api.add_resource(UsersById, '/users', '/users/<int:user_id>')
api.add_resource(QueryResource, '/queries', '/queries/<int:query_id>')




if __name__ == '__main__':
    app.run(port=5555, debug=True)
