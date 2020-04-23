import sqlite3

class ItemsModel:
    def __init__(self,name,price):
        self.name = name
        self.price = price
    
    def json(self):
        return {'name':self.name,'Price':self.price}

    @classmethod
    def find_items_by_name(cls,name):
        connection = sqlite3.connect('Flask/SQLAlchemy/data.db')
        cursor = connection.cursor()
        select_query = "SELECT * FROM items WHERE name =?"
        result = cursor.execute(select_query,(name,))
        row = result.fetchone()
        connection.close()
        if row:
            return cls(*row)

    
    def insert(self):
        connection = sqlite3.connect('Flask/SQLAlchemy/data.db')
        cursor = connection.cursor()
        insert_query = "INSERT INTO items VALUES (?,?)"
        cursor.execute(insert_query,(self.name,self.price))
        connection.commit() 
        connection.close()

    
    
    def update(self):
        connection = sqlite3.connect('Flask/SQLAlchemy/data.db')
        cursor = connection.cursor()
        update_query = "UPDATE items SET Price=? WHERE name=?"
        cursor.execute(update_query,(self.price,self.name))
        connection.commit()
        connection.close()
