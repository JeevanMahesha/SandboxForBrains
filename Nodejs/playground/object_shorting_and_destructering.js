// shortening the object 

const name = 'jeevan'
const userAge = 23

const user = {
    name,
    userAge,
    'address': 'mysore'
}

console.log(user);

// Destructer the object
const product = {
    'lable': 'Apple',
    'Price': 20,
    'stock': 222,
    'sealprice': undefined,
    'rating': 5.3
}
const { lable, Price, stock, rating = 5 } = product
console.log(rating);

// Destructer the object in function

const transcation = (type, { lable, Price, sealprice }) => {
    console.log(type, lable, sealprice);
}

transcation('ordered', product)