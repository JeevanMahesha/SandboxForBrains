from pymongo import MongoClient

def connectDB():
    client = MongoClient("mongodb+srv://ezhil55:ezhil55@cluster0.xaim7.mongodb.net/<dbname>?retryWrites=true&w=majority")
    db = client.get_database("Ezhilarasi_5591")
    return db.Ezhil_5591
