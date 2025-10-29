import base64
import numpy as np 
import json
from PIL import Image
import face_recognition as fr
from io import BytesIO
from flask_restful import Resource, reqparse

# get the encodeing of the employee
with open('Json/Face_Encoding_Data.json') as f:
    EncodeJsonData = json.load(f)
    personName = list(EncodeJsonData.keys())
    encodedImgList = list(EncodeJsonData.values())

class Base64(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument(
        'encode',
        type=str,
        required=True,
        help="Encoded data required"
    )
    def post(self):
        imgLink = 'https://raw.githubusercontent.com/Jeevan-M/staffImages/master/'
        req_data = Base64.parser.parse_args()
        base64Data = req_data['encode']
        byte_data = base64.b64decode(base64Data)
        image_data = BytesIO(byte_data)
        encodeFace = fr.load_image_file(image_data)
        encodeFace = fr.face_encodings(encodeFace)[0]
        matches = fr.compare_faces(encodedImgList, encodeFace, tolerance=0.5)
        faceDist = fr.face_distance(encodedImgList, encodeFace)
        matchIndex = np.argmin(faceDist)
        name = 'Unknow Person'
        if matches[matchIndex]:
            name = personName[matchIndex]
            return {'Name': name, "img": f"{imgLink}{name}.jpg"}, 200
        return {'Name': name}, 404

        
        
