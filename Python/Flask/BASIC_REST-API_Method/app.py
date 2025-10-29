from flask import Flask,jsonify,request,render_template

app = Flask(__name__)

stores = [
    {
    'name': 'My Store',
    'items': [
        {'name':'my item',
        'price': 15.99 
        }
        ]
}]

@app.route('/')
def home():
    return render_template('index.html')


#POST store
@app.route('/Create_store', methods=['POST'])
def Create_store():
    request_data = request.get_json()
    new_data = {
        'name':request_data['name'],
        'items':[]
    }
    stores.append(new_data)
    return jsonify(stores)



#get /store/<name> data: {name :}
@app.route('/store/<string:name>')
def Get_store(name):
    for i in stores:
        if i['name']== name:
            return jsonify(i)
    return jsonify({'Error Message':'Store not found'})


#get /store
@app.route('/store',methods=['GET'])
def Get_all_store():
    return jsonify({'store':stores})



#post /store/<name> data: {name :}
@app.route('/store/<string:name>', methods=['POST'])
def Create_store_items(name):
    request_data = request.get_json()
    for i in stores:
        if i['name']==name:
            new_item = {
                'name':request_data['name'],
                'price':request_data['price']
            }
            i['items'].append(new_item)
            return jsonify(stores)
    return jsonify({'Error Message':'Store not found'})



#get /store/<name>/item 
@app.route('/store/<string:name>/items')
def Get_store_items(name):
    for i in stores:
        if i['name']== name:
            return jsonify({'items':i['items']})
    return jsonify({'Error': f'There is no items as {name}'})



app.run(port=5000)  