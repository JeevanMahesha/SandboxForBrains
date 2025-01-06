/* 
1. chalk package is used for give style for font 

*/
const chalk = require('chalk')

console.log(chalk.green('Success'));

console.log(chalk.bold('Success'));

console.log(chalk.inverse('Success'));

//single line using chalk
console.log(chalk.bold.red('ERROR'));