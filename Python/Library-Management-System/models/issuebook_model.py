from db_connection import db_connect
import datetime 
import json



class issueBook(db_connect.Model):
    __tablename__ = 'issuebook'
    id = db_connect.Column(db_connect.Integer,primary_key=True,autoincrement=True)
    bookid = db_connect.Column(db_connect.String(45),db_connect.ForeignKey('allbooks.bookid'))
    book = db_connect.relationship('BookModel')
    userid = db_connect.Column(db_connect.String(45),db_connect.ForeignKey('users.userid'))
    user = db_connect.relationship('UserModel')
    status = db_connect.Column(db_connect.String(45))
    borrow_date = db_connect.Column(db_connect.Date)
    return_date = db_connect.Column(db_connect.Date)

    def __init__(self,LMSBOOKID,LMSID):
        self.bookid = LMSBOOKID
        self.userid = LMSID
        self.status = 'Bookissued'
        self.borrow_date = datetime.date.today()
        self.return_date = datetime.date.today() + datetime.timedelta(days=10)

    def json(self):
        return{
            'status' : self.status,
            'borrow_date' :  self.borrow_date.__str__(),
            'return_date' :  self.return_date.__str__()
        }

    @classmethod
    def find_user_count(cls,userid):
        return cls.query.filter_by(userid=userid).count()

    @classmethod
    def find_the_userissued_book(cls,userid):
        return cls.query.filter_by(userid=userid).all()

    @classmethod
    def find_book_count(cls,bookid):
        return cls.query.filter_by(bookid=bookid).count()


    
    @classmethod
    def borrow_status(cls,LMSBOOKID,LMSID):
        return cls.query.filter_by(bookid=LMSBOOKID).filter_by(userid=LMSID).first()

    def issueTheBook(self):
        db_connect.session.add(self)
        db_connect.session.commit()
        return True

    def returnBookDelete(self):
        db_connect.session.delete(self)
        db_connect.session.commit()
        return True

