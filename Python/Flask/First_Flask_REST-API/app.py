from flask import Flask
from flask_restful import Resource,Api

app = Flask(__name__)

API = Api(app)

class Student(Resource):
    def get(self,name):
        return {'Name' : name}

API.add_resource(Student,'/student/<string:name>')

app.run()
