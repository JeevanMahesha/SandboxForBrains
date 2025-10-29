const { MongoClient, ObjectID } = require('mongodb')


const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager-db'

MongoClient.connect(connectionURL, { 'useNewUrlParser': true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect the Database');
    }
    const db = client.db(databaseName)
        // DELETE MANY RECORD IN DATABASE
        // db.collection('user').deleteMany({
        //         age: 43
        //     }).then((result) => {
        //         console.log(result);
        //     }).catch((error) => {
        //         console.log(error);
        //     })

    // DELETE ONE RECORD IN DATABASE
    db.collection('task').deleteOne({
        _id: new ObjectID("5ed4b7ba8ce52a209c1d340c")
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })
})