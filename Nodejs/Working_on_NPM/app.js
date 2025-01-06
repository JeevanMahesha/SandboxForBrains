/* 
how to install npm module 
1. command for install npm module is 
        npm init 

*/
//---------------------------------------------------------------------------------------------------------
/* 
1. Install the required NPM package from npmjs.com 
2. how to install the package 
    a. install i {package name} along with version if it require
    b. example without version{
            install i validator
    }
    c. example with version{
            install i validator@12.0.0
    }
3. you can use the in-Built function by calling it function name
*/
const validator = require('validator')

/* 
--------------------                     Email Valiation                --------------------------------------
1. validating the given email using nmp package in the below 
        example {
            a. its correct email the function will return true
            b. its wrong email the function will return false
}
*/
console.log(validator.isEmail('Jeevan@gmail.com'));
console.log(validator.isEmail('Jeevan@gmailcom'));

/* 
--------------------                     URL Valiation                --------------------------------------
1. validating the given URL using nmp package in the below 
        example {
            a. its correct URL the function will return true
            b. its wrong URL the function will return false
}
 */
console.log(validator.isURL('https://www.google.com'));
console.log(validator.isURL('https://Jeevangmailcom'));