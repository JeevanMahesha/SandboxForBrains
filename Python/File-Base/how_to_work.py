# import the file (file name fileBase)
import fileBase as fb

"""
 This is sample input json object
 Time-To-Live is optional if you don't give it will assign as null value
"""
jsonData = {
    "key1": {
        "data1": "value1",
        "data2": "value2",
        "data3": "value3",
        "Time-To-Live": 1000,
    },
    "key2": {
        "data1": "value1",
        "data2": "value2",
        "data3": "value3",
        "Time-To-Live": 500,
    },
    "key3": {
        "data1": "value1",
        "data2": "value2",
        "data3": "value3",
        "data4": "value4",
    },
    "key4": {
        "data1": "value1",
        "data2": "value2",
        "data3": "value3",
        "Time-To-Live": 1050,
    }
}

"""
* filePath is option if you give the required directory path
* [DB.json] file will be created on given path
* The default directory path is your current project location
* if default value is passed it will create new directory called [DATABASE] (point 2 will be repeat)
* Each time when you invoke the createData,readData,deleteData you have to pass the directory path
"""


filePath = '<Please give your required directory path >'

""" With directory path give """

# Create Method
fb.createData(jsonData, filePath)

# Read Method
fb.readData('key1', filePath)

# Delete Method
fb.deleteData('key2', filePath)


""" Without directory path """

# Create Method
fb.createData(jsonData)

# Read Method
fb.readData('key4')

# Delete Method
fb.deleteData('key2')
