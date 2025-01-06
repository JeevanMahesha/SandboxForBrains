import os
from package.Config import settings
from package.utils.filehandle import checkFile, generateFolder
from package.DataCRD.CRD import DataStoreCRD


def createData(jsonData, filePath=settings.DEFAULT_FILE_PATH):
    if not generateFolder(filePath):
        print(f'Error to Create a File in \n{filePath}\n')
        return False
    filePath = os.path.join(filePath, settings.DEFAULT_FILE_NAME)
    data, message = DataStoreCRD(filePath).createDataStore(jsonData)
    if not data:
        print(message, '\n')
        return False
    print(message, '\n')
    return True


def readData(keyValue, filePath=settings.DEFAULT_FILE_PATH):
    if not checkFile(filePath):
        print(f"File dosen't exist in this path \n{filePath} \n")
        return False
    filePath = os.path.join(filePath, settings.DEFAULT_FILE_NAME)
    data, message = DataStoreCRD(filePath).readDataStore(keyValue)
    if not data:
        print(message, '\n')
        return False
    print(message, '\n')
    return True


def deleteData(keyValue, filePath=settings.DEFAULT_FILE_PATH):
    if not checkFile(filePath):
        print(f"File dosen't exist in this path \n{filePath} \n")
        return False
    filePath = os.path.join(filePath, settings.DEFAULT_FILE_NAME)
    data, message = DataStoreCRD(filePath).deleteDataStore(keyValue)
    if not data:
        print(message, '\n')
        return False
    print(message, '\n')
    return True
