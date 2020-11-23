from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from pymongo import MongoClient
from datetime import datetime
from os import walk
from pymongo import MongoClient
from datetime import datetime
from django.shortcuts import redirect
import csv
import os
import numpy as np
import face_recognition as fr
import cv2
import json
import time

client = MongoClient(
    "mongodb+srv://ezhil55:ezhil55@cluster0.xaim7.mongodb.net/<dbname>?retryWrites=true&w=majority")
print("Client Connected ...")
db = client.get_database("Ezhilarasi_5591")
records = db.Ezhil_5591
print("Database Connected ...")


# Create your views here.

# store the image function
def storeImage(name,  frame):

    # path to image folder
    path = './dataset/'

    # Get the current date for image
    current_date = datetime.now().strftime("%d-%m-%Y")

    if(os.path.isdir(path+name)):
        cv2.imwrite(path+name+'/'+name+'_'+current_date+'_'+'.jpg', frame)
    else:
        os.mkdir(path+name)
        cv2.imwrite(path+name+'/'+name+'_'+current_date+'_'+'.jpg', frame)



def attendancelist(request):
    date = datetime.now().strftime("%d-%m-%Y")
    datas = list(records.find({"Date": str(date)}))
    if datas != []:
        return render(request, "attendance_data.html", {"data": datas})
    else:
        data = Object_To_Dict(datas)
        return render(request, "attendance_data.html", {"data": data})


def face_reg_attendance(request, slug):
    Date = datetime.now().strftime("%d-%m-%Y")

    def Attendance(Name):
        Time = datetime.now().strftime("%H:%M:%S %p")
        Date = datetime.now().strftime("%d-%m-%Y")
        checkdata = list(records.find({'Name': Name, 'Date': Date}))
        if str(slug) == "check_in":
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
            print("Database Inserted ...")
        elif str(slug) == "check_out" and checkdata != []:
            if checkdata[0]['Check_out_Time'] == "":
                b = []
                Decoded_Start = jsonDecoder(checkdata[0]['Check_in_Time'])
                Start = str(Decoded_Start[0])
                End = Time
                b.append(Time)
                time_diff_date = datetime.now().strftime("%Y %m %d")
                Working_Hours = TimeDiff(Start, End, time_diff_date)
                data = {
                    "Check_out_Time": json.dumps(b),
                    "Working_Hours": Working_Hours
                }
                records.update_one(
                    {"Name": Name, 'Date': Date}, {"$set": data})
            else:
                print(checkdata)
                Decoded_End = jsonDecoder(checkdata[0]['Check_out_Time'])
                Decoded_Start = jsonDecoder(checkdata[0]['Check_in_Time'])
                Decoded_End.append(str(Time))
                Start = str(Decoded_Start[0])
                End = str(Decoded_End[-1])
                time_diff_date = datetime.now().strftime("%Y %m %d")
                Working_Hours = TimeDiff(Start, End, time_diff_date)
                data = {
                    "Check_out_Time": json.dumps(Decoded_End),
                    "Working_Hours": Working_Hours
                }
                records.update_one(
                    {"Name": Name, 'Date': Date}, {"$set": data})
            print("Database Updated ...")
        return str(Name), str(Time)
    video = cv2.VideoCapture(0)
    File_Dir_names = []
    for (dirpath, dirnames, filenames) in walk("images"):
        File_Dir_names.extend(dirnames)
        break
    known_face_encodings = []
    known_names = []
    for dirname in File_Dir_names:
        Image_path = []
        for (dirpath, dirnames, filenames) in walk("images/"+str(dirname)):
            Image_path.extend(filenames)
        for image in Image_path:
            Training_Image_path = "images/"+str(dirname)+"/"+str(image)
            train_image = fr.load_image_file(Training_Image_path)
            train_image_encoding = fr.face_encodings(train_image)[0]
            known_face_encodings.append(train_image_encoding)
            known_names.append(dirname)
        print(known_names)
    print("Face Encoding Done ...")
    while True:
        ret, frame = video.read()
        # The image transforms to the colour RGB order
        rgb_frame = frame[:, :, ::-1]
        face_locations = fr.face_locations(rgb_frame)
        face_encodings = fr.face_encodings(rgb_frame, face_locations)
        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
            name = "Unknown"
            matches = fr.compare_faces(known_face_encodings, face_encoding, tolerance=0.5)
            face_distances = fr.face_distance(known_face_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)
            if matches[best_match_index]:
                name = known_names[best_match_index]
                Name_ID, Time_ID = Attendance(name)
                storeImage(name, frame)
                Dbdata = list(records.find({'Name': Name_ID, 'Date': Date}))
                if str(slug) == "check_in":
                    message = "Checked in."
                    # + str(Dbdata[0]["Check_in_Time"])
                elif str(slug) == "check_out":
                    message = "Checked out. "
                    # + str(Dbdata[0]["Check_out_Time"])
            if name == "Unknown":
                cv2.rectangle(frame, (left + 2, top + 2),
                              (right + 2, bottom + 2), (0, 128, 255), 1)
                cv2.rectangle(frame, (left, bottom - 35),
                              (right, bottom), (0, 128, 255), cv2.FILLED)
                font = cv2.FONT_HERSHEY_SCRIPT_COMPLEX
                cv2.putText(frame, name, (left + 6, bottom - 6),
                            font, 1.0, (0, 0, 0), 1)
            else:
                cv2.rectangle(frame, (left + 2, top + 2),
                              (right + 2, bottom + 2), (0, 128, 0), 1)
                cv2.rectangle(frame, (left, bottom - 35),
                              (right, bottom), (0, 128, 0), cv2.FILLED)
                font = cv2.FONT_HERSHEY_SIMPLEX
                cv2.putText(frame, name, (left + 6, bottom - 6),
                            font, 1.0, (0, 0, 0), 1)
                cv2.putText(frame, message, (left, bottom + 52),
                            font, 0.5, (42, 163, 38), 2)
        cv2.imshow("Attendance Portal", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    video.release()
    cv2.destroyAllWindows()
    return redirect(reverse("attendance_Home"))


def csvsending(request):
    csv_path = "attendance_data.csv"
    data_file = open(csv_path, 'w', newline="")
    csv_writer = csv.writer(data_file)
    count = 0
    time = datetime.now().strftime("%d-%m-%Y")
    data = list(records.find({"Date": str(time)}))
    datas = Object_To_Dict(data)
    for emp in datas:
        if count == 0:
            header = emp.keys()
            headers = list(header)
            csv_writer.writerow(headers)
            count += 1
        csv_writer.writerow(emp.values())
    data_file.close()
    return render(request, "attendance_data.html", {"data": datas, "message": "Successfully converted"})


def MailAttendance(request):
    import smtplib
    import mimetypes
    from email.mime.multipart import MIMEMultipart
    from email import encoders
    from email.message import Message
    from email.mime.audio import MIMEAudio
    from email.mime.base import MIMEBase
    from email.mime.image import MIMEImage
    from email.mime.text import MIMEText

    emailfrom = "TestMailPythonML@gmail.com"
    emailto = "ezhilsathishcdc@siet.ac.in"
    fileToSend = "attendance_data.csv"
    username = "TestMailPythonML@gmail.com"
    password = "TestMailPythonML@4224"

    msg = MIMEMultipart()
    msg["From"] = emailfrom
    msg["To"] = emailto
    date = datetime.now().strftime("%d-%m-%Y")
    msg["Subject"] = "Attendance Report "+str(date)
    msg.preamble = "Attendance Report "+str(date)

    ctype, encoding = mimetypes.guess_type(fileToSend)
    if ctype is None or encoding is not None:
        ctype = "application/octet-stream"

    maintype, subtype = ctype.split("/", 1)

    if maintype == "text":
        fp = open(fileToSend)
        # Note: we should handle calculating the charset
        attachment = MIMEText(fp.read(), _subtype=subtype)
        fp.close()
    elif maintype == "image":
        fp = open(fileToSend, "rb")
        attachment = MIMEImage(fp.read(), _subtype=subtype)
        fp.close()
    elif maintype == "audio":
        fp = open(fileToSend, "rb")
        attachment = MIMEAudio(fp.read(), _subtype=subtype)
        fp.close()
    else:
        fp = open(fileToSend, "rb")
        attachment = MIMEBase(maintype, subtype)
        attachment.set_payload(fp.read())
        fp.close()
        encoders.encode_base64(attachment)
    attachment.add_header("Content-Disposition",
                          "attachment", filename=fileToSend)
    msg.attach(attachment)

    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login(username, password)
    server.sendmail(emailfrom, emailto, msg.as_string())
    server.quit()
    data = list(records.find({"Date": str(date)}))
    return render(request, "attendance_data.html", {"data": data, "message": "Mail Successfully Sent"})

# Functions


def TimeDiff(Start, End, Date):
    date = Date.split()
    Start_time = Start.split()
    S_time = Start_time[0].split(":")
    End_time = End.split()
    E_time = End_time[0].split(":")
    Time_Diff = datetime(int(date[0]), int(date[1]), int(date[2]), int(E_time[0]), int(E_time[1]), int(E_time[2])) - datetime(
        int(date[0]), int(date[1]), int(date[2]), int(
            S_time[0]), int(S_time[1]), int(S_time[2])
    )
    working_hours = str(round(Time_Diff.seconds/3600, 3)) + " hrs"
    return working_hours


def jsonDecoder(data):
    jsonDec = json.decoder.JSONDecoder()
    value = jsonDec.decode(data)
    return value


def Object_To_Dict(Data):
    new_data = []
    for data in Data:
        if data['Check_out_Time'] == "":
            check_out_Time = ""
        else:
            check_out_Time = jsonDecoder(data['Check_out_Time'])[-1]
        dict_data = {
            "Name": data['Name'],
            "Date": data['Date'],
            "Status": data['Status'],
            "Check_in_Time": jsonDecoder(data['Check_in_Time'])[0],
            "Check_out_Time": check_out_Time,
            "Working_Hours": data['Working_Hours']}
        new_data.append(dict_data)
    return new_data
