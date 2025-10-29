console.log('The file name is utils.js');

const name = 'jeevan'

//Exporting the name variable for global files
module.exports = name
//---------------------------------------------------------------------------------------------------------

// Creating the function to add 2 numbers 
const add = function(a,b){
    return a+b
}

// Exporting the function for global 
module.exports = add