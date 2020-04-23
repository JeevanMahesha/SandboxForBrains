from flask import Flask
from flask_restful import Api
from flask_jwt import JWT
from security import authenticate,identity
from user import UserRegister
from items import Items,ItemsList

app = Flask(__name__)
API = Api(app)
app.secret_key = 'jeevan'

jwt = JWT(app,authenticate,identity) #/auth

API.add_resource(Items,'/item/<string:name>')
API.add_resource(ItemsList,'/items')
API.add_resource(UserRegister,'/register')

if __name__ == "__main__":
    app.run(debug=True)