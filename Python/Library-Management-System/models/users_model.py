from db_connection import db_connect
from werkzeug.security import generate_password_hash
import random

class UserModel(db_connect.Model):
    __tablename__ = "users"
    id = db_connect.Column(db_connect.Integer,nullable=False,primary_key=True,autoincrement=True)
    userid = db_connect.Column(db_connect.String(45),nullable=False,unique=True,primary_key=True,autoincrement=False)
    user = db_connect.relationship('issueBook',lazy='dynamic')
    name = db_connect.Column(db_connect.String(45))
    email = db_connect.Column(db_connect.String(45),unique=True)
    usertype = db_connect.Column(db_connect.String(45))
    phone = db_connect.Column(db_connect.String(45))
    password = db_connect.Column(db_connect.String(100))
    nobookissue = db_connect.Column(db_connect.Integer)
    maxbook = db_connect.Column(db_connect.Integer)

    

    def __init__(self,Name,Email,Type,Phone,Password):
        self.userid = 'LMSID'+str(random.randrange(1111, 9999))
        self.name = Name.upper()
        self.email = Email
        self.usertype = Type
        self.phone = Phone
        self.password = generate_password_hash(Password)
        self.nobookissue = 0
        self.maxbook = 10

    def json(self):
        return {
            "id" : self.id,
    "Userid":self.userid,
	"Name":self.name,
	"Email":self.email,	
	"Type":self.usertype,
	"Phone":self.phone,
	"nobookissue":self.nobookissue,
    "maxbook":self.maxbook
}
    
    @classmethod
    def find_by_user_email(cls,email):
        return cls.query.filter_by(email=email).first()

    @classmethod
    def find_by_user_userid(cls,userid):
        return cls.query.filter_by(userid=userid).first()


    def saveUserToDB(self):
        db_connect.session.add(self)
        db_connect.session.commit()
    



