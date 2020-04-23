import sqlite3
from flask_restful import Resource,reqparse
from flask_jwt import jwt_required
from models.itemsmodel import ItemsModel

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
        items = ItemsModel.find_items_by_name(name)
        if items:
            return items.json()        
        return {'message':'No Record Found in Data Base'},400

    def post(self,name):
        if ItemsModel.find_items_by_name(name):
            return {'Message':f'The item with name {name} is already exisit'},400
        request_data = Items.parser.parse_args()
        items_list = ItemsModel(name,request_data['Price'])
        try:
            items_list.insert()
        except:
            return {'message':'An error occurred inserting an item'},500
        return items_list.json()

    def delete(self,name):
        if ItemsModel.find_items_by_name(name) :
            connection = sqlite3.connect('Flask/SQLAlchemy/data.db')
            cursor = connection.cursor()
            delete_query = "DELETE FROM items WHERE name=?"
            cursor.execute(delete_query,(name,))
            connection.commit()
            connection.close()
            return {'Message':f'Item {name} is Deleted'}
        return {'Message':f'The Item {name} is not in the database'}
        

    def put(self,name):
        request_data = Items.parser.parse_args()
        if ItemsModel.find_items_by_name(name):
            item = ItemsModel(name,request_data['Price'])
            try:
                item.update()
                return item.json()
            except:
                return {'message':'An error occurred inserting an item'},500
        return {'Message':'No Record Found in DataBase To update'},400


class ItemsList(Resource):
    def get(self):
        connection = sqlite3.connect('Flask/SQLAlchemy/data.db')
        cursor = connection.cursor()
        selete_query = "SELECT * FROM items"
        result = cursor.execute(selete_query)
        all_items = []
        for i in result:
            all_items.append({'name':i[0],'Price':i[1]})
        return {'All items':all_items}
