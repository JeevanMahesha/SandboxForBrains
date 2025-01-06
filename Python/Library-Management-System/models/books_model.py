from db_connection import db_connect
import random

class BookModel(db_connect.Model):
    __tablename__ = "allbooks"
    id = db_connect.Column(db_connect.Integer,primary_key=True,autoincrement=True)
    bookid = db_connect.Column(db_connect.String(45),primary_key=True, autoincrement=False,nullable=False,unique=True)
    book = db_connect.relationship('issueBook',lazy='dynamic')
    authorname = db_connect.Column(db_connect.String(45))
    bookname = db_connect.Column(db_connect.String(45))
    totalbook = db_connect.Column(db_connect.Integer)
    remainingbook = db_connect.Column(db_connect.Integer)

    def __init__(self,AuthorName,BookName,TotalBook):
        self.bookid = 'LMSBOOKID'+str(random.randrange(1111,9999))
        self.authorname = AuthorName
        self.bookname = BookName
        self.totalbook = TotalBook
        self.remainingbook = TotalBook

    @classmethod
    def find_by_bookname(cls,bookname):
        return cls.query.filter_by(bookname=bookname).first()
    

    @classmethod
    def find_by_bookid(cls,bookid):
        return cls.query.filter_by(bookid=bookid).first()
    
    def deleteBook(self):
        db_connect.session.delete(self)
        db_connect.session.commit()
 
    def saveBookToDB(self):
        db_connect.session.add(self)
        db_connect.session.commit()

    def json(self):
        return {'id':self.id,    'bookid':self.bookid,'authorname':self.authorname,'bookname':self.bookname,'totalbook':self.totalbook,'remainingbook':self.remainingbook}
    