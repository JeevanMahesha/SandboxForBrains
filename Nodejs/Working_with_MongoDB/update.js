const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager-db'

MongoClient.connect(connectionURL, { 'useNewUrlParser': true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect the Database');
    }
    const db = client.db(databaseName)

    // ====== UPDATE THE RECORD IN DB
    db.collection('user').updateOne({
        _id: new ObjectID("5ed4b2f4682e59220c5081dd")
    }, {
        $set: {
            name: "Latha",
            age: 40
        }
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })

    //======> UPDATE THE MANY RECORD    
    db.collection('task').updateMany({
        completed: false
    }, {
        $set: {
            completed: true
        }
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })
})