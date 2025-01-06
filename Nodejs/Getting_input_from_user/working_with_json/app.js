const fs = require('fs')
const book = {
    title : 'Wings of fire',
    author : 'APJ'
}

// converting the object into json formate 
const bookjson = JSON.stringify(book)

//--------------------------  CREATING THE NEW JSON FILE---------------------------------------------

//creating the new json file using the writeFileSync function

//fs.writeFileSync('json_data.json',bookjson)

//-------------------------- READING THE JSON FILE --------------------------------------------------

// reading the json data from the json file using the readFileSync function

// dataBuffer while get the data from the json file as Binary data 
const dataBuffer =  fs.readFileSync('json_data.json')

// toSrting function will convert the binary to string 
const dataJSON = dataBuffer.toString()

//parseing the json data from json file
const data = JSON.parse(dataJSON)

//printing the json data
console.log(data.title);
