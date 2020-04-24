from flask import Flask
from flask_restful import Api
from flask_jwt import JWT
from security import authenticate,identity
from resources.user import UserRegister
from resources.items import Items,ItemsList
from resources.store import Store,StoreList

app = Flask(__name__)
API = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'jeevan'

jwt = JWT(app,authenticate,identity) #/auth

@app.before_first_request
def create_table():
    db.create_all()


API.add_resource(Store,'/store/<string:name>')
API.add_resource(StoreList,'/stores')
API.add_resource(Items,'/item/<string:name>')
API.add_resource(ItemsList,'/items')
API.add_resource(UserRegister,'/register')

if __name__ == "__main__":
    from db import db
    db.init_app(app)
    app.run(debug=True)