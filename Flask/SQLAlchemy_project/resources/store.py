from flask_restful import Resource
from models.store_model import StoreModel

class Store(Resource):
    def get(self,name):
        store = StoreModel.find_items_by_name(name)
        if store:
            return store.json()
        return {'message':'No Store found'},404


    def post(self,name):
        store = StoreModel.find_items_by_name(name)
        if store:
            return {'message':'Store Already Exist'}
        store_new = StoreModel(name)
        try:    
            store_new.save_to_db()
        except:
            return {'message':'server Error while creating'},500
        return store_new.json()
        
    
    def delete(self,name):
        store = StoreModel.find_items_by_name(name)
        if store:
            store.delete()
            return {'Message':f'store {name} is Deleted'}
        return {'Message':f'The store {name} is not in the database'}
    

class StoreList(Resource):
    def get(self):
        return {'Stores' : list(map(lambda x: x.json(),StoreModel.query.all()))}