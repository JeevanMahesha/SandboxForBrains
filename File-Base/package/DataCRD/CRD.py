import json
import fcntl
import threading
from ..utils.filehandle import fileAccess
from dateutil.parser import parse
from datetime import datetime, timedelta
from os.path import getsize
from sys import getsizeof


class DataStoreCRD:
    def __init__(self, dbPath):
        self.dbPath = dbPath

    def checkTimeToLive(self, value):
        currentTime = parse(value['CreatedAt'])
        timeToLive = value['Time-To-Live']
        if timeToLive:
            expired_datetime = currentTime + timedelta(seconds=timeToLive)
            remaining_seconds = (expired_datetime -
                                 datetime.now()).total_seconds()
            if remaining_seconds <= 0:
                return False
        return True

    def checkDataToProcess(self, keyValue):

        if not self.dbPath:
            return False, "Empty DataStore. Data not found for the key."

        fileJsonData = fileAccess(self.dbPath)
        if keyValue not in fileJsonData.keys():
            return False, "No data found for the key provided."

        if not self.checkTimeToLive(fileJsonData.get(keyValue)):
            return False, "Requested data is expired for the key."
        return True, fileJsonData.get(keyValue)

    def dataValidation(self, jsonData):
        if not isinstance(jsonData, dict):
            return False, "Incorrect  data format. Only JSON object with key-value pair is acceptable."

        if getsizeof(json.dumps(jsonData)) > 1000000000:
            return False, "DataStore limit will exceed 1GB size."

        for key, value in jsonData.items():
            if len(key) > 32:
                return False, "The keys must be in 32 characters length."

            if not isinstance(value, dict):
                return False, "The values must be in JSON object formats."

            if getsizeof(value) > 16384:
                return False, "The values must be in 16KB size."

        if getsize(self.dbPath) >= 1000000000:
            return False, "File Size Exceeded 1GB."

        keyCheck = any(key in jsonData.keys()
                       for key in fileAccess(self.dbPath).keys())
        if keyCheck:
            return False, "Key already exist in DataStore."
        return True, ''

    def threadingFunction(self, jsonDataValue):
        def dataCreated(jsonDataKey):
            for i, key in enumerate(jsonDataKey):
                singleValue = jsonDataValue[key]
                singleValue["CreatedAt"] = datetime.now().isoformat()
                singleValue["Time-To-Live"] = singleValue["Time-To-Live"] if 'Time-To-Live' in singleValue else None
                jsonDataValue[key] = singleValue
        thread_count = 4
        items = list(jsonDataValue.keys())

        split_size = len(items) // thread_count

        threads = []
        for i in range(thread_count):
            start = i * split_size
            end = None if i+1 == thread_count else (i+1) * split_size

            threads.append(threading.Thread(
                target=dataCreated, args=(items[start:end], ), name=f"t{i+1}"))
            threads[-1].start()
        for t in threads:
            t.join()
        return jsonDataValue

    def createDataStore(self, jsonData):
        data, message = self.dataValidation(jsonData)
        if not data:
            return False, message
        jsonData = self.threadingFunction(jsonData)
        fileJsonData = fileAccess(self.dbPath)
        fileJsonData.update(jsonData)
        if getsizeof(fileJsonData) >= 1000000000:
            return False, "File Size Exceeded 1GB."
        with open(self.dbPath, 'w+') as file:
            fcntl.flock(file, fcntl.LOCK_EX)
            json.dump(fileJsonData, file)
            fcntl.flock(file, fcntl.LOCK_UN)
        return True, "Data created in DataStore."

    def readDataStore(self, keyValue):
        data, valueMessage = self.checkDataToProcess(keyValue)
        if not data:
            return data, valueMessage
        del valueMessage['CreatedAt']
        return data, valueMessage

    def deleteDataStore(self, keyValue):
        data, valueMessage = self.checkDataToProcess(keyValue)
        if not data:
            return data, valueMessage
        fileJsonData = fileAccess(self.dbPath)
        del fileJsonData[keyValue]
        with open(self.dbPath, 'w+') as file:
            fcntl.flock(file, fcntl.LOCK_EX)
            json.dump(fileJsonData, file)
            fcntl.flock(file, fcntl.LOCK_UN)
        return True, "Data is deleted from the datastore."
