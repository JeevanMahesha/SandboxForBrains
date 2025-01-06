const express = require("express");
const etcdClient = require("./etcd")

const app = express();

app.use(express.json())

let Mongo = {
    UserName: null,
    Password: null
}
let MongoUserPass = ["UserName", "Password"]


MongoUserPass.forEach(each => {
    getDataFromETCD(each)
})

async function getDataFromETCD(keyValue) {
    Mongo[keyValue] = await etcdClient.getValueFromETCD(keyValue);
    const watcher = await etcdClient.watchTheKeyValueChange(keyValue);
    watcher.on("put", putTheChangedValue)
}


function putTheChangedValue(watchValue) {
    let { key, value } = watchValue
    Mongo[key.toString()] = value.toString()
}

setInterval(() => {
    console.log(Mongo);
}, 2000)

app.listen(8080, () => {
    console.log("I'm Up");
})

