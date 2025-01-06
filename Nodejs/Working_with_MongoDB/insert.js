const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager-db'

MongoClient.connect(connectionURL, { 'useNewUrlParser': true }, (error, clinet) => {
    if (error) {
        return console.log('Unable to connect the database');
    }
    const db = clinet.db(databaseName)

    //=======    INSERT ONE RECORD TO DB  ==========
    db.collection('user').insertOne({
        "name": "mahesh",
        "age": 43
    }, (error, result) => {
        if (error) {
            return console.log('Unable to insert to db');
        }
        console.log(result.ops);
    })

    //=======    INSERT MANY RECORD TO DB  ==========
    // db.collection('task').insertMany([{
    //     description: "this is first record",
    //     completed: true
    // }, {
    //     description: "this is secound record",
    //     completed: false
    // }, {
    //     description: "this is third record",
    //     completed: true
    // }], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert record');
    //     }
    //     console.log(result.ops);
    // })
})