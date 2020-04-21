import sqlite3

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
    def find_user_by_id(cls,_id):
        connection = sqlite3.connect('Flask/simple_project_using_Database/data.db')
        cursor = connection.cursor()
        seletc_query = 'SELECT * FROM user WHERE id = ?'
        result = cursor.execute(seletc_query,(_id,))
        row = result.fetchone()
        if row:
            user = cls(*row)
        else:
            user = None
        return user
