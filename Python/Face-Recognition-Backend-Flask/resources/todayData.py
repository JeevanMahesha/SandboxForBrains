from flask_restful import Resource
from resources.dbConnect import connectDB
from resources.extraFunction import filterData,accessJsonFile
from pytz import timezone
from datetime import datetime

records = connectDB()
personName , encodedImgList = accessJsonFile()

def createObject(name):
    return {
    'Name': name,
    'Date': datetime.now().strftime("%d-%m-%Y"),
    'Status':"Absent",
    'Check_in_Time': None,
    'Check_out_Time':  None,
    'Working_Hours': None
}

class todayData(Resource):
    def get(self):
        todayAttendance = [filterData(i) for i in list(records.find({'Date': datetime.now(
            timezone('Asia/Kolkata')).strftime("%d-%m-%Y")}))]
        totalPresent = len(todayAttendance)
        totalAbsent = len(personName)-totalPresent
        presentPercentage = round((totalPresent / len(personName))*100,2)
        todayPresentNameList = [i.get('Name') for i in todayAttendance]
        for index,value in enumerate(personName):
            if value not in todayPresentNameList:
                todayAttendance.append(createObject(value))  
        todayAttendance = sorted(todayAttendance,key=lambda x:x['Name'])  
        return {
            'totalPresent':totalPresent,
            'totalAbsent':totalAbsent,
            'totalStaff':len(personName),
            'presentPercentage':presentPercentage,
            'todayAttendance':todayAttendance
            }
        





