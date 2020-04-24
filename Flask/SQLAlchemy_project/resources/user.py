from flask_restful import Resource,reqparse
from models.usermodel import UserModel


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
        if UserModel.find_user_by_username(request_date['username']):
            return {'Message': f"The username {request_date['username']} is already exist"},400
        user = UserModel(**request_date)
        user.save_to_db()
        return {'Message':'User Register Successfully...'},201