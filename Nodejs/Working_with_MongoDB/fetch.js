const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager-db'

MongoClient.connect(connectionURL, { 'useNewUrlParser': true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect the Database');
    }
    const db = client.db(databaseName)
        //====== find the one record from the database
    db.collection('user').findOne({ _id: new ObjectID("5ed4b2f4682e59220c5081dd") }, (error, result) => {
        if (error) {
            return console.log('Unable to fetch data');
        }
        console.log(result);
    })

    //====== find the all record which match 
    db.collection('user').find({ age: 23 }).toArray((error, user) => {
        console.log(user)
    })

    //==== find the count of record which match
    db.collection('user').find({ age: 23 }).count((error, userCount) => {
        console.log(userCount)
    })

    // === challenge given
    // db.collection('task').findOne({ _id: new ObjectID("5ed4b7ba8ce52a209c1d340d") }, (error, result) => {
    //     if (error) {
    //         console.log('unable to find');
    //     }
    //     console.log(result);
    // })

    // db.collection('task').find({ completed: false }).toArray((error, result) => {
    //     console.log(result);
    // })


})