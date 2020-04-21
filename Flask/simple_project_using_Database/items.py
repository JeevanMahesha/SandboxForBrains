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
        connection = sqlite3.connect('Flask/simple_project_using_Database/data.db')
        cursor = connection.cursor()
        select_query = "SELECT * FROM items WHERE name =?"
        result = cursor.execute(select_query,(name,))
        row = result.fetchone()
        connection.close()
        if row:
            return {'items': {'name':row[0],'Price':row[1]}},200
        return {'message':'No Record Found in Data Base'},400
    
    def post(self,name):
        if next(filter(lambda item_name: item_name['name'] == name,items_list),None):
            return {'Message':f'The item with name {name} is already exisit'},400
        
        request_data = Items.parser.parse_args()
        items_list.append({'name':name,'Price':request_data['Price']})
        return items_list,201

    def delete(self,name):
        global items_list
        items_list = list(filter(lambda  x: x['name'] != name,items_list))
        return {'Message':'Items Deleted'}

    def put(self,name):
        request_data = Items.parser.parse_args()
        item = next(filter(lambda it: it['name'] == name,items_list),None)
        if item is None:
            item = {'name':name,'Price':request_data['Price']}
            items_list.append(item)
        else:
            items_list.append(request_data)
        return item


class ItemsList(Resource):
    def get(self):
        return {'All items':items_list}
