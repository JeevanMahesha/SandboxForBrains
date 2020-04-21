from flask import Flask,request
from flask_restful import Resource,Api
from flask_jwt import jwt_required,JWT
from security import authenticate,identity


app = Flask(__name__)
API = Api(app)
app.secret_key = 'jeevan'
items_list = []

jwt = JWT(app,authenticate,identity) #/auth

class Items(Resource):
    @jwt_required()
    def get(self,name):
        items = next(filter(lambda item_name: item_name['name'] == name,items_list),None)
        return{'items':items} ,200 if items else  404
    
    def post(self,name):
        if next(filter(lambda item_name: item_name['name'] == name,items_list),None):
            return {'Message':f'The item with name {name} is already exisit'},400
        request_data = request.get_json()
        items_list.append({'name':name,'Price':request_data['Price']})
        return items_list,201

    def delete(self,name):
        global items_list
        items_list = list(filter(lambda  x: x['name'] != name,items_list))
        return {'Message':'Items Deleted'}

class ItemsList(Resource):
    def get(self):
        return {'All items':items_list}

API.add_resource(Items,'/item/<string:name>')
API.add_resource(ItemsList,'/items')


app.run(debug=True)