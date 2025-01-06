from os import path, makedirs
from ..Config import settings
import json
import fcntl


class CreateFolder:
    def __init__(self, folderPath):
        self.folderPath = folderPath

    def createNewFolder(self):
        try:
            makedirs(self.folderPath, mode=0o777, exist_ok=True)
        except PermissionError:
            return False
        return True


class CreateFile:
    def __init__(self, fileName):
        self.fileName = fileName

    def createFile(self, folderPath):
        filePath = path.join(folderPath, self.fileName)
        if not(path.isfile(filePath)):
            with open(filePath, 'w') as outfile:
                json.dump({}, outfile)


def fileAccess(dbPath):
    with open(dbPath) as file:
        fcntl.flock(file, fcntl.LOCK_EX)
        data = json.load(file)
        fcntl.flock(file, fcntl.LOCK_UN)
        return data


def checkFile(filePath):
    filePath = path.join(filePath, settings.DEFAULT_FILE_NAME)
    if not path.isfile(filePath):
        return False
    return True


def generateFolder(filePath, fileName=settings.DEFAULT_FILE_NAME):
    try:
        if filePath != settings.DEFAULT_FILE_PATH:
            CreateFile(fileName).createFile(
                filePath)
        elif filePath == settings.DEFAULT_FILE_PATH:
            CreateFolder(filePath).createNewFolder()
            CreateFile(fileName).createFile(
                filePath)
    except PermissionError:
        return False
    finally:
        return checkFile(filePath)
    return True
