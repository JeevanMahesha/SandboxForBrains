from flask_restful import Resource,reqparse
from models.users_model import UserModel
from models.books_model import BookModel
from models.issuebook_model import issueBook
from db_connection import db_connect
from werkzeug.security import check_password_hash


class UserResource(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument(
        'Name',
        type=str,
        required=True,
        help='Name field is required'
    )
    parser.add_argument(
        'Email',
        type=str,
        required=True,
        help='Email field is required'
    )
    parser.add_argument(
        'Type',
        type=str,
        required=True,
        help='Type field is required'
    )
    parser.add_argument(
        'Phone',
        type=int,
        required=True,
        help='Phone field is required'
    )
    parser.add_argument(
        'Password',
        type=str,
        required=True,
        help='Password field is required'
    )
    def post(self):
        request_data = UserResource.parser.parse_args()
        if UserModel.find_by_user_email(request_data['Email']):
            return {'Message': f'The {request_data["Email"]} email is already exist','status':400},400
        user_register = UserModel(**request_data)
        try:
            user_register.saveUserToDB()
            return {'Message': f'Hi, {request_data["Name"]} your Registration is Successfully.....!','status':201},201
        except:
            return {'Message':'An Internal Server Error occurred While Register the user','status':500},500
        
class UserResourceUpdate(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument(
        'LMSID',
        type=str,
        required=True,
        help='Name field is required'
    )
    parser.add_argument(
        'Name',
        type=str,
        required=True,
        help='Name field is required'
    )
    parser.add_argument(
        'Email',
        type=str,
        required=True,
        help='Email field is required'
    )
    parser.add_argument(
        'Type',
        type=str,
        required=True,
        help='Type field is required'
    )
    parser.add_argument(
        'Phone',
        type=int,
        required=True,
        help='Phone field is required'
    )
    def put(self):
        request_data = UserResourceUpdate.parser.parse_args()
        olduserdata = UserModel.find_by_user_userid(request_data['LMSID'])
        if olduserdata:
            try:
                olduserdata.name = request_data['Name'].upper()
                olduserdata.email = request_data['Email']
                olduserdata.usertype = request_data['Type']
                olduserdata.phone = request_data['Phone']
                olduserdata.saveUserToDB()
                return {'Message': f'{request_data["Name"]} Your Details are Updated','status':200},200
            except:
                return {'Message':'An Internal Server Error occurred While updating the user','status':500},500
        return {'Message':'User Does not exist','status':400},400


class UserResourceDetails(Resource):
        def get(self,userid,value=None):
            if value == 'USERDETAILS':    
                user_details = UserModel.find_by_user_userid(userid)
                if user_details:
                    return user_details.json()
                return {'Message':'User Does not exist'},400
            elif value == 'USERISSUEDBOOKS':
                allbookanduser =  [[book.json(),user.json(),issuebook.json()] for book,issuebook,user in db_connect.session.query(BookModel,issueBook,UserModel).join(BookModel, BookModel.bookid == issueBook.bookid).join(UserModel, UserModel.userid == issueBook.userid).all()]
                return {'userissuebooks': [detail for i,detail in enumerate(allbookanduser) if detail[1].get('Userid') == userid] } 

                    
class UserResourceLogin(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument(
        'Email',
        type=str,
        required=True,
        help='Email field is required'
    )
    parser.add_argument(
        'Password',
        type=str,
        required=True,
        help='Password field is required'
    )
    def post(self):
        request_data = UserResourceLogin.parser.parse_args()
        user_details = UserModel.find_by_user_email(request_data['Email'])
        try:    
            if user_details and check_password_hash(user_details.password ,request_data['Password']):
                return {'Message': f'Welcome {user_details.name}.......','status':200,'Userid':user_details.userid},200
        except:
            return {'Message':'Internal Server Error','status':500},500
        return {'Message':'Oops Login Failed....!','status':400},400



