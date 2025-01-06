from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from resources.users_resource import UserResource,UserResourceDetails,UserResourceLogin,UserResourceUpdate
from resources.books_resource import BooksResource 
from resources.admin_resource import AdminLoginResource,GetAllBooksAndIssuedInLibrary
from resources.issuebook_resource import issueBookResource

app = Flask(__name__)
CORS(app)   
endpoint_api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] =  'mysql://root:''@localhost/lms' #'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

@app.before_first_request
def create_tables():
    db_connect.create_all()            


endpoint_api.add_resource(UserResourceDetails,'/user/<string:value>,<string:userid>')
endpoint_api.add_resource(UserResourceUpdate,'/userupdate')
endpoint_api.add_resource(UserResource,'/register')
endpoint_api.add_resource(UserResourceLogin,'/userlogin')
endpoint_api.add_resource(BooksResource,'/insertbook')
endpoint_api.add_resource(AdminLoginResource,'/AdminLogin')
endpoint_api.add_resource(issueBookResource,'/issuebook')
endpoint_api.add_resource(GetAllBooksAndIssuedInLibrary,'/getbookanduserdetails/<string:value>')

if __name__ == "__main__":
    from db_connection import db_connect
    db_connect.init_app(app)
    app.run(debug=True)