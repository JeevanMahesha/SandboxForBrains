// ================== STRING IN JAVASCRIPT
let firstName = 'Jeevan'
let lastName = 'M'

let fullName = firstName + ' ' + lastName
    // console.log(fullName);
    // console.log(fullName.toUpperCase());
    // console.log(fullName.toLowerCase());

let email = 'jeevan@gmail.com'
    // console.log(email.slice(0, 5));
    // replace function will only replace first index of that char
    // console.log(email.replace('j', 'J'));

// ========================= NUMBERS IN JAVASCRIPT
let radius = 10
const pi = 3.14

//  B I D M A S
let result = pi * radius ** 2
    //console.log(result);
    // console.log(5 * (10 - 3) ** 2 + 100 / 20);


// math operatores +,-,*,/,**,%
// console.log(1 + 1);
// console.log(1 - 1);
// console.log(1 * 1);
// console.log(1 / 1);
// console.log(2 ** 2);

// short-hand
let like = 1
    // console.log(like++);
    // console.log(like--);
    // console.log(like += 10);
    // console.log(like -= 1);
    // console.log(like *= 200);
    // console.log(like /= 100);

// NaN
// console.log(5 / 'hello');
// console.log(5 * 'hello');

// concatenation
const title = 'Rich dad poor dad'
const author = 'Jeevan'
const likes = 1000

let concatenation = 'The Blog name ' + title + ' by author ' + author + ' has ' + likes + ' Likes'
    //console.log(concatenation);

let templet = `The ${title} Blog by ${author} has ${likes} likes`
    // console.log(templet);

let html = `
<h4>The blog ${title}</h4>
<h5>by ${author}</h5>
<p>have ${likes} Likes</p>
`
    // console.log(html);

// ======================  ARRAY

let ninjas = ['latha', 'raja', 'jeevan']
let joinArray = ninjas.join(',')
    //console.log(ninjas.indexOf('raja')); // find the index of the element
    //console.log(ninjas.concat(['mahesha']));
ninjas.push('mahesha')
    // console.log(ninjas);
ninjas.pop()
    // console.log(ninjas);

// ==================   Boolean
email = 'jeevan@gmail.com'
result = email.includes('@')
    // console.log(result);
let age = 22
    // loose comparison
    // console.log(age == 22);
    // console.log(age != 22);
    // console.log(age > 20);
    // console.log(age < 20);
    // console.log(age >= 22);
    // console.log(age <= 21);

// strict comparison
// console.log(age === 22);
// console.log(age !== 22);

// Type Convertion
let score = '100'
console.log(Number(score) + 1);
console.log(typeof score);