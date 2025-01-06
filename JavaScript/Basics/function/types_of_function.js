const name = 'Jeevan'
let age = 23
const hasHobbie = true

// normal function
// function summeryUser(userName, userAge, userHobbi) {
//     return (
//         'Name is ' +
//         userName +
//         ' Age is ' +
//         userAge +
//         ' have hobbie ' +
//         userHobbi
//     );
// }

//  anonymous function
// const summeryUser = function(userName, userAge, userHobbi) {
//     return (
//         'Name is ' +
//         userName +
//         ' Age is ' +
//         userAge +
//         ' have hobbie ' +
//         userHobbi
//     );
// }


// arrow function
const summeryUser = (userName, userAge, userHobbi) => {
        return (
            'Name is ' +
            userName +
            ' Age is ' +
            userAge +
            ' have hobbie ' +
            userHobbi
        );
    }
    // only return value
const add = (a, b) => a + b;

// only one parameter
const addOne = a => a + 1;


// with no parameter
const addRandom = () => 1 + 1;

// console.log(add(1, 2));
// console.log(addOne(1));
console.log(addRandom());
// console.log(summeryUser(name, age, hasHobbie));