from flask_restful import Resource , reqparse
from werkzeug.security import check_password_hash
import json

with open('Json/loginDB.json') as loginDBFile:
    loginDB = json.load(loginDBFile)




class loginAdmin(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument(
        'userName',
        type=str,
        required=True,
        help='UserName is required'
    )
    parser.add_argument(
        'password',
        type=str,
        required=True,
        help='Password is required'
    )
        
    def post(self):
        request_data = loginAdmin.parser.parse_args()
        return {"status":True} if loginDB['username'] == request_data["userName"] and check_password_hash(loginDB['password'],request_data['password']) else {"status":False}