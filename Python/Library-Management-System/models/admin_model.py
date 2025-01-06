from db_connection import db_connect


class AdminModel(db_connect.Model):
    __tablename__ = "admin"
    id = db_connect.Column(db_connect.Integer,primary_key=True)
    username = db_connect.Column(db_connect.String(20),unique=True)
    password = db_connect.Column(db_connect.String(40))

    @classmethod
    def find_by_username(cls,username):
        return cls.query.filter_by(username=username).first()
