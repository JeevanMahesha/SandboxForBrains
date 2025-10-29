//The require function intergrate the two different files 
// name variable is a referance variable it can be anything 
const name = require('./utils.js')

// declaring and printing in same file 
//const name = 'JEEVAN'  

//Accessing the name variable from another file and printing here
console.log(name);

//------------------------------------------------------------------------------------------------------------

// Accessing the add function from the util file 
const add_function = require('./utils.js')

//passing the number for the function and get the output in sum 
const sum = add_function(3,6)

// printing the answer in log
console.log(sum);

//----------------------------------------------------------------------------------------------------------

const getnodes = require('./notes.js')

const msg = getnodes()

console.log(msg);
