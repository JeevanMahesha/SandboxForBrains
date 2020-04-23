import sqlite3
from flask_restful import Resource,reqparse
from flask_jwt import jwt_required

class Items(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument(
        'Price',
        type=float,
        required=True,
        help='This Field is required'
    )
    @jwt_required()
    def get(self,name):
        items = self.find_items_by_name(name)
        if items:
            return items        
        return {'message':'No Record Found in Data Base'},400
    
    @classmethod
    def find_items_by_name(cls,name):
        connection = sqlite3.connect('Flask/simple_project_using_Database/data.db')
        cursor = connection.cursor()
        select_query = "SELECT * FROM items WHERE name =?"
        result = cursor.execute(select_query,(name,))
        row = result.fetchone()
        connection.close()
        if row:
            return {'items': {'name':row[0],'Price':row[1]}},200

    @classmethod
    def insert(self,items_list):
        connection = sqlite3.connect('Flask/simple_project_using_Database/data.db')
        cursor = connection.cursor()
        insert_query = "INSERT INTO items VALUES (?,?)"
        cursor.execute(insert_query,(items_list['name'],items_list['Price']))
        connection.commit() 
        connection.close()


    def post(self,name):
        if self.find_items_by_name(name):
            return {'Message':f'The item with name {name} is already exisit'},400
        request_data = Items.parser.parse_args()
        items_list = {'name':name,'Price':request_data['Price']}
        try:
            self.insert(items_list)
        except:
            return {'message':'An error occurred inserting an item'},500
        return items_list

    def delete(self,name):
        if self.find_items_by_name(name) :
            connection = sqlite3.connect('Flask/simple_project_using_Database/data.db')
            cursor = connection.cursor()
            delete_query = "DELETE FROM items WHERE name=?"
            cursor.execute(delete_query,(name,))
            connection.commit()
            connection.close()
            return {'Message':f'Item {name} is Deleted'}
        return {'Message':f'The Item {name} is not in the database'}
        

    def put(self,name):
        request_data = Items.parser.parse_args()
        if self.find_items_by_name(name):
            item = {'name':name,'Price':request_data['Price']}
            try:
                self.update(item)
                return item
            except:
                return {'message':'An error occurred inserting an item'},500
        return {'Message':'No Record Found in DataBase To update'},400

    @classmethod
    def update(cls,item):
        connection = sqlite3.connect('Flask/simple_project_using_Database/data.db')
        cursor = connection.cursor()
        update_query = "UPDATE items SET Price=? WHERE name=?"
        cursor.execute(update_query,(item['Price'],item['name']))
        connection.commit()
        connection.close()

class ItemsList(Resource):
    def get(self):
        connection = sqlite3.connect('Flask/simple_project_using_Database/data.db')
        cursor = connection.cursor()
        selete_query = "SELECT * FROM items"
        result = cursor.execute(selete_query)
        all_items = []
        for i in result:
            all_items.append({'name':i[0],'Price':i[1]})
        return {'All items':all_items}
