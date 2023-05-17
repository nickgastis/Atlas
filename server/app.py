from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from models import db, User, Query, Post
from flask import request, make_response, abort, jsonify, render_template, session
import os
from dotenv import load_dotenv
from flask_migrate import Migrate
load_dotenv('../.env.local')

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('EXTERNAL_DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

migrate = Migrate(app, db)

db.init_app(app)
api = Api(app)


class UsersById(Resource):
    def get(self, user_id):
        user = User.query.get(user_id)
        if user:
            return {
                'id': user.id,
                'username': user.username,
                'email': user.email
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
