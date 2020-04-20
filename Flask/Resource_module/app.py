from flask import Flask,request
from flask_restful import Resource,Api

app = Flask(__name__)

items_list = []

API = Api(app)

class Items(Resource):
    def get(self,name):
        for i in items_list:
            if i['name'] == name:
                return i
        return {'Error Message' : f'No item found link {name}'},404
    
    def post(self,name):
        request_data = request.get_json()
        items_list.append({'name':name,'Price':request_data['Price']})
        return items_list,201

class ItemsList(Resource):
    def get(self):
        return {'All items':items_list}

API.add_resource(Items,'/item/<string:name>')
API.add_resource(ItemsList,'/items')


app.run(debug=True)