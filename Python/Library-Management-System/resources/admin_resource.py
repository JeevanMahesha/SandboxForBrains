from flask_restful import Resource,reqparse
from models.admin_model import AdminModel
from werkzeug.security import check_password_hash
from models.books_model import BookModel
from models.issuebook_model import issueBook
from models.users_model import UserModel
from db_connection import db_connect

class AdminLoginResource(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument(
        'username',
        type=str,
        required=True,
        help='This username  Field is required'
    )
    parser.add_argument(
        'password',
        type=str,
        required=True,
        help='This password Field is required'
    )
    def post(self):
        request_data = AdminLoginResource.parser.parse_args()
        admin = AdminModel.find_by_username(request_data['username'])
        try:    
            if admin and check_password_hash(admin.password,request_data['password']):
                return {'Message':'Admin Login Successfull','status':200}
        except:
            return {'Message':'Internal Server Error','status':500},500
        return {'Message':'Admin Login Falied....','status':400},400

class GetAllBooksAndIssuedInLibrary(Resource):
    def get(self,value=None):
        if value == 'ALLBOOK':
            return {'AllBook':list(map(lambda book: book.json() , BookModel.query.all()))}
        elif value == 'ISSUEBOOK':
            # l = []
            # for b,iss,u in db_connect.session.query(BookModel,issueBook,UserModel).join(BookModel, BookModel.bookid == issueBook.bookid).join(UserModel, UserModel.userid == issueBook.userid).all():
            #     t = []
            #     t.append(b.json())
            #     t.append(u.json())
            #     l.append(t)
            # return l
            return {'issuebook': [[book.json(),user.json()] for book,issuebook,user in db_connect.session.query(BookModel,issueBook,UserModel).join(BookModel, BookModel.bookid == issueBook.bookid).join(UserModel, UserModel.userid == issueBook.userid).all()]}
        elif value == 'ALLUSER':
            return {'AllUser':list(map(lambda user: user.json() , UserModel.query.all()))}
        elif value == 'ALLUSERBOOKISSUECOUNT':
            issuebookcount = issueBook.query.count()
            usercount= UserModel.query.count()
            bookcount = BookModel.query.count()
            return {'issuebookcount':issuebookcount,'usercount':usercount,'bookcount':bookcount}