import schedule
import time
from datetime import datetime
import os
from pymongo import MongoClient
import csv
from views import Object_To_Dict

client = MongoClient(
    "mongodb+srv://ezhil55:ezhil55@cluster0.xaim7.mongodb.net/<dbname>?retryWrites=true&w=majority")
db = client.get_database("Ezhilarasi_5591")
records = db.Ezhil_2_12_2020
print("Database Connected ...")
current_date = datetime.now().strftime("%d-%m-%Y")
fileName = '_'.join(['AttendanceReport', current_date, '.csv'])
csv_path = 'Report/'+fileName


def ConvertToCSV():
    if not (os.path.isfile(csv_path)):
        with open(csv_path, 'w', newline='') as file:
            csv.writer(file)
    data_file = open(csv_path, 'w', newline="")
    csv_writer = csv.writer(data_file)
    count = 0
    data = list(records.find({"Date": str(current_date)}))
    datas = Object_To_Dict(data)
    for emp in datas:
        if count == 0:
            header = emp.keys()
            headers = list(header)
            csv_writer.writerow(headers)
            count += 1
        csv_writer.writerow(emp.values())
    data_file.close()
    print(f'{fileName} Created')


cschedule.every().day.at("22:00").do(ConvertToCSV)

while True:
    schedule.run_pending()
    time.sleep(1)
