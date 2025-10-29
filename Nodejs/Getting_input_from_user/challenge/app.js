const fs = require('fs')

const dataBuffer =  fs.readFileSync('json_data.json')
const dataJSON = dataBuffer.toString()
const user_data = JSON.parse(dataJSON)

user_data.name = 'Latha'
user_data.age = 40

const json_data = JSON.stringify(user_data)

fs.writeFileSync('json_data.json',json_data)