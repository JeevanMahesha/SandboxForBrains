import sqlite3
from flask_restful import Resource,reqparse


class User:
    def __init__(self,_id,username,password):
        self.id = _id
        self.username = username
        self.password = password

    @classmethod
    def find_user_by_username(cls,username):
        connection = sqlite3.connect('Flask/simple_project_using_Database/data.db')
        cursor = connection.cursor()
        seletc_query = 'SELECT * FROM user WHERE username = ?'
        result = cursor.execute(seletc_query,(username,))
        row = result.fetchone()
        if row:
            user = cls(*row)
        else:
            user = None
        return user
    

    @classmethod
    def find_user_by_id(cls,id):
        connection = sqlite3.connect('Flask/simple_project_using_Database/data.db')
        cursor = connection.cursor()
        seletc_query = 'SELECT * FROM user WHERE id = ?'
        result = cursor.execute(seletc_query,(id,))
        row = result.fetchone()
        if row:
            user = cls(*row)
        else:
            user = None
        return user


class UserRegister(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument(
        'username',
        type=str,
        required=True,
        help='This Filed is Required'
    )
    parser.add_argument(
        'password',
        type=str,
        required=True,
        help='This Filed is Required'
    )
    def post(self):
        request_date = UserRegister.parser.parse_args()
        if User.find_user_by_username(request_date['username']):
            return {'Message': f"The username {request_date['username']} is already exist"},400
        connection = sqlite3.connect('Flask/simple_project_using_Database/data.db')
        cursor = connection.cursor()
        insert_query = "INSERT INTO user VALUES (NULL,?,?)"
        cursor.execute(insert_query,(request_date['username'],request_date['password']))
        connection.commit()
        connection.close
        return {'Message':'User Register Successfully...'},201