const book = {
    title : 'Wings of fire',
    author : 'APJ'
}

// converting the object into json formate 
const bookjson = JSON.stringify(book)

// printing the json object
console.log('Encoding json data   =   ' + bookjson);

// parsed is used to decode the json data or get the data from the json object
const parsedDate = JSON.parse(bookjson)

// printing the json object
console.log('Decoding json data   =   ', parsedDate);