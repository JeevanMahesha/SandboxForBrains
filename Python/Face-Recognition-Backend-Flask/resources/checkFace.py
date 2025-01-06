from flask_restful import Resource, reqparse
import numpy as np
import face_recognition as fr
import json
from flask_jwt_extended import jwt_required
from resources.extraFunction import accessJsonFile
personName , encodedImgList = accessJsonFile()

class CheckUserFace(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument(
        'encode',
        action='append',
        required=True,
        help='encoded data is required'
    )

    def post(self):
        imgLink = 'https://raw.githubusercontent.com/Jeevan-M/staffImages/master/'
        request_data = CheckUserFace.parser.parse_args()
        request_data['encode'] = list(map(float, request_data['encode']))
        encodeFace = np.array(request_data['encode'])
        matches = fr.compare_faces(encodedImgList, encodeFace, tolerance=0.5)
        faceDist = fr.face_distance(encodedImgList, encodeFace)
        matchIndex = np.argmin(faceDist)
        name = 'Unknow Person'
        if matches[matchIndex]:
            name = personName[matchIndex]
            return {'Name': name, "img": f"{imgLink}{name}/{name}.jpg"}, 200
        return {'Name': name}, 404



class GetStaffName(Resource):
    def get(self):
        return {'staffName': personName}
