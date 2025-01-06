// Spread operator

var car = { type: "Fiat", model: "500", color: "white" };

const suv = {...car }

var cars = ["Saab", "Volvo", "BMW"];

const fourWheel = [...cars]

// console.log(suv);
// console.log(fourWheel);

// rest operator

const toArray = (...args) => args

// console.log(toArray(1, 2, 3, 4, 5));
// ======================================================

const myArray = [
    [{
        "color": "purple",
        "type": "minivan",
        "registration": new Date('2017-01-03'),
        "capacity": 7
    }, {
        "color": "red",
        "type": "station wagon",
        "registration": new Date('2018-03-03'),
        "capacity": 5
    }],
    [{
        "color": "green",
        "type": "minivan",
        "registration": new Date('2017-01-03'),
        "capacity": 7
    }, {
        "color": "balck",
        "type": "station wagon",
        "registration": new Date('2018-03-03'),
        "capacity": 5
    }, {
        "color": "white",
        "type": "station wagon",
        "registration": new Date('2018-03-03'),
        "capacity": 5
    }]

]
const newArray = []
myArray.forEach(element => {
    newArray.push(...element)
});

// console.log(newArray);

// ======================================================

// Object Destructuring

// TYPE 1

var car = { type: "Fiat", model: "500", color: "white" };

const getTypeAndModel = ({ type, model }) => {
        console.log(type, model);
    }
    // getTypeAndModel(car)
    // ======================================================
    // TYPE 2
const { type, model } = car
// console.log(type, model);
// ======================================================

// ARRAY Destructuring
var cars = ["Saab", "Volvo", "BMW"];

const [saab, Volvo] = cars
console.log(saab, Volvo);