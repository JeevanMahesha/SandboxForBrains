import json
from datetime import datetime
import os
import csv

# gives the time differenc
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


# gives the json value
def jsonDecoder(data):
    jsonDec = json.decoder.JSONDecoder()
    value = jsonDec.decode(data)
    return value


def filterData(data):
    return {
        'Name': data.get('Name'),
        'Date': data.get('Date'),
        'Status':data.get('Status'),
        'Check_in_Time': jsonDecoder(data.get('Check_in_Time'))[-1],
        'Check_out_Time': jsonDecoder(data.get('Check_out_Time'))[-1] if data.get('Check_out_Time') else None,
        'Working_Hours': data.get('Working_Hours') if data.get('Working_Hours') else None
    }


def checkTheUser(Name):
    with open('Json/Face_Encoding_Data.json') as f:
        EncodeJsonData = json.load(f)
        personName = list(EncodeJsonData.keys())
    return True if Name in personName else False


def addJWT(jwt):
    jwtJSONFile = 'Json/JWT.json'
    if os.path.isfile(jwtJSONFile):
        os.remove(jwtJSONFile)
    with open(jwtJSONFile, 'w') as outfile:
        json.dump({'token': jwt}, outfile)
        return True


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


def ConvertToCSV(csv_path, data):
    if not (os.path.isfile(csv_path)):
        with open(csv_path, 'w', newline='') as file:
            csv.writer(file)
    data_file = open(csv_path, 'w', newline="")
    csv_writer = csv.writer(data_file)
    count = 0
    datas = Object_To_Dict(data)
    for emp in datas:
        if count == 0:
            header = emp.keys()
            headers = list(header)
            csv_writer.writerow(headers)
            count += 1
        csv_writer.writerow(emp.values())
    data_file.close()
    return True


def MailAttendance(file, toEmail):
    import smtplib
    import mimetypes
    from email.mime.multipart import MIMEMultipart
    from email import encoders
    from email.message import Message
    from email.mime.audio import MIMEAudio
    from email.mime.base import MIMEBase
    from email.mime.image import MIMEImage
    from email.mime.text import MIMEText

    emailfrom = "sietstaffattendance@gmail.com"
    emailto = toEmail
    fileToSend = file
    username = "sietstaffattendance@gmail.com"
    password = "siet@123staff"

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
                          "attachment", filename=fileToSend.split('/')[1])
    msg.attach(attachment)

    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login(username, password)
    server.sendmail(emailfrom, emailto, msg.as_string())
    server.quit()
    return True


def accessJsonFile():
    with open('Json/Face_Encoding_Data.json') as f:
        EncodeJsonData = json.load(f)
        return list(EncodeJsonData.keys()),list(EncodeJsonData.values())