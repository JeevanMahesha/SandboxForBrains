from flask import Flask,request
from flask_restful import Resource,Api

app = Flask(__name__)
API = Api(app)
items_list = []

class Items(Resource):
    def get(self,name):
        items = next(filter(lambda item_name: item_name['name'] == name,items_list),None)
        return{'items':items} ,200 if items else  404
    
    def post(self,name):
        if next(filter(lambda item_name: item_name['name'] == name,items_list),None):
            return {'Message':f'The item with name {name} is already exisit'},400
        request_data = request.get_json()
        items_list.append({'name':name,'Price':request_data['Price']})
        return items_list,201

class ItemsList(Resource):
    def get(self):
        return {'All items':items_list}

API.add_resource(Items,'/item/<string:name>')
API.add_resource(ItemsList,'/items')


app.run(debug=True)