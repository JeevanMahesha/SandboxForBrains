from flask_restful import Resource, reqparse
from resources.dbConnect import connectDB
from datetime import datetime
from resources.extraFunction import TimeDiff, jsonDecoder, filterData, checkTheUser
import json
from pytz import timezone
records = connectDB()

class UserToDB(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument(
        'Name',
        type=str,
        required=True,
        help='Name data is required'
    )

    def post(self, check):
        request_data = UserToDB.parser.parse_args()
        Name = request_data['Name']
        if not checkTheUser(Name):
            return {'Message': f'{Name} is not exist in json file'}, 400
        Time = datetime.now(timezone('Asia/Kolkata')).strftime("%H:%M:%S %p")
        Date = datetime.now(timezone('Asia/Kolkata')).strftime("%d-%m-%Y")
        checkdata = list(records.find({'Name': Name, 'Date': Date}))
        if check == 'checkIn':
            if checkdata == []:
                a = []
                a.append(Time)
                a = json.dumps(a)
                data = {
                    "Name": Name,
                    "Status": "Present",
                    "Date": Date,
                    "Check_in_Time": a,
                    "Check_out_Time": "",
                    "Working_Hours": ""
                }
                records.insert_one(data)
            else:
                get_Time = checkdata[0]["Check_in_Time"]
                data = jsonDecoder(get_Time)
                data.append(Time)
                datas = {
                    "Check_in_Time": json.dumps(data)
                }
                records.update_one(
                    {"Name": Name, 'Date': Date}, {"$set": datas})
            return filterData(list(records.find({'Name': Name, 'Date': Date}))[0]), 201
        elif check == 'checkOut' and checkdata != []:
            if checkdata[0]['Check_out_Time'] == "":
                b = []
                Decoded_Start = jsonDecoder(
                    checkdata[0]['Check_in_Time'])
                Start = str(Decoded_Start[0])
                End = Time
                b.append(Time)
                time_diff_date = datetime.now(
                    timezone('Asia/Kolkata')).strftime("%Y %m %d")
                Working_Hours = TimeDiff(
                    Start, End, time_diff_date)
                data = {
                    "Check_out_Time": json.dumps(b),
                    "Working_Hours": Working_Hours
                }
                records.update_one(
                    {"Name": Name, 'Date': Date}, {"$set": data})
            else:
                Decoded_End = jsonDecoder(checkdata[0]['Check_out_Time'])
                Decoded_Start = jsonDecoder(checkdata[0]['Check_in_Time'])
                Decoded_End.append(str(Time))
                Start = str(Decoded_Start[0])
                End = str(Decoded_End[-1])
                time_diff_date = datetime.now(
                    timezone('Asia/Kolkata')).strftime("%Y %m %d")
                Working_Hours = TimeDiff(Start, End, time_diff_date)
                data = {
                    "Check_out_Time": json.dumps(Decoded_End),
                    "Working_Hours": Working_Hours
                }
                records.update_one(
                    {"Name": Name, 'Date': Date}, {"$set": data})
            return filterData(list(records.find({'Name': Name, 'Date': Date}))[0]), 201
        else:
            return {'Message': 'Wrong Request'}, 400



