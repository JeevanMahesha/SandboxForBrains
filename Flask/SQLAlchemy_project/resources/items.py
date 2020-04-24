from flask_restful import Resource,reqparse
from flask_jwt import jwt_required
from models.itemsmodel import ItemsModel

class Items(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument(
        'price',
        type=float,
        required=True,
        help='This Field is required'
    )
    parser.add_argument(
        'store_id',
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
        items_list = ItemsModel(name,**request_data)
        try:
            items_list.save_to_db()
        except:
            return {'message':'An error occurred inserting an item'},500
        return items_list.json()

    def delete(self,name):
        item = ItemsModel.find_items_by_name(name)
        if item:
            item.delete()
            return {'Message':f'Item {name} is Deleted'}
        return {'Message':f'The Item {name} is not in the database'}


    def put(self,name):
        request_data = Items.parser.parse_args()
        item = ItemsModel.find_items_by_name(name)
        if item:
            try:
                item.price = request_data['price']
                item.save_to_db()
            except:
                return {'message':'An error occurred updateing an item'},500
            return {'message':'Record Updated'}
        else:
            return {'Message':'No Record Found in DataBase To update'},400


class ItemsList(Resource):
    def get(self):
        return {'All items': list(map( lambda x: x.json() , ItemsModel.query.all()))}
