// function Declaration
function greet() {
    console.log('hello world');
}
// in this method function can called before function decalaration 
// greet()

// function expression and arguments and parameter with default values
const speak = function(name = 'NAME') {
        console.log(`Hello ${name} have a good day!`);
    }
    // this function can only called after the declaration
    // speak('Jeevan')

// return value from JavaScript
// const calArea = function(radius) {
//         return 3.14 * radius ** 2
//     }
// console.log(calArea(50));

// Arrow Function
// const calArea = (radius) => {
//     return 3.14 * radius ** 2
// }
// console.log(calArea(50));
// with one parameter
const calArea = radius => 3.14 * radius ** 2;
// console.log(calArea(50));

// =============== CALLBACK FUNCTION

const myFunc = (callbackFunc) => {
    let value = 50
    callbackFunc(value)
}

myFunc(value => {
    console.log(value);

})

// forEach
let people = ['latha', 'raja', 'mahesha', 'varsha', 'jeevan']
let person = (person, index) => {
    console.log(`${person} in ${index} index`)
}
people.forEach(person)