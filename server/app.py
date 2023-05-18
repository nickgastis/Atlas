from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from models import db, User, Query, Post
from flask import request, make_response, abort, jsonify, render_template, session
import os
from dotenv import load_dotenv
from flask_migrate import Migrate
load_dotenv('../.env.local')
from flask_login import LoginManager, login_user, current_user, login_required



app = Flask(__name__)
app.secret_key = os.environ.get('APP_SECRET_KEY')
login_manager = LoginManager(app)
login_manager.login_view = 'login'

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('EXTERNAL_DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

migrate = Migrate(app, db)

db.init_app(app)
api = Api(app)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))





@app.route('/auth/callback', methods=['POST'])
def auth_callback():
    data = request.json
    print(data)
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




@app.route('/current_user', methods=['GET'])
@login_required
def get_current_user():
    auth0_id = session.get('auth0_id')

    if auth0_id:
        current_user = User.query.get(auth0_id).first()
        if current_user:
            return {
                'username': current_user.username,
                'email': current_user.email,
                'sub': current_user.sub
            }
        else:
            return {'message': 'User not found'}, 404

    return {'message': 'Unauthorized'}, 401


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



# class CheckSession(Resource):
#     def get(self):
#         if not session.get('user_id'):
#             return make_response({'error': '401 Unauthorized'}, 401)

#         the_user = User.query.filter_by(id=session['user_id']).first()
#         return make_response(the_user.to_dict(), 200)

# api.add_resource(CheckSession, '/check_session')


# class Login(Resource):
#     def post(self):
#         data = request.get_json()

#         the_user = User.query.filter_by(username=data.get('username')).first()

#         if not the_user:
#             return make_response({'error': 'Username does not exist'}, 404)

#         if not the_user.authenticate(data.get('password')):
#             return make_response({'error': 'Invalid password'}, 400)

#         session['user_id'] = the_user.id
#         return make_response(the_user.to_dict(), 200)

# api.add_resource(Login, '/login')


# class Logout(Resource):
#     def delete(self):
#         if session.get('user_id'):
#             session['user_id'] = None
#             return make_response({'message': 'Successfully logged out'}, 204)

#         return make_response({'error': '401 Unauthorized'}, 401)

# api.add_resource(Logout, '/logout')


if __name__ == '__main__':
    app.run(port=5555, debug=True)