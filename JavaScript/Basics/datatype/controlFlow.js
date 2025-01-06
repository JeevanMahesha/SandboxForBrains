// for loop
let ninjas = ['latha', 'raja', 'jeevan']
    // for (i = 0; i < ninjas.length; i++) {
    //     console.log(`My Name is ${ninjas[i]}`);
    // }

// while loop
let i = 0
    // while (i < 5) {
    //     console.log("i'm Running ", i);
    //     i++
    // }
    // ============ do while
    // do {
    //     console.log("i'm Running ", i);
    //     i++
    // }
    // while (i < 5)

// if else $ else if
let age = 2
    // if (age > 22) {
    //     console.log('true')
    // } else if (age == 22) {
    //     console.log('true but equal');
    // } else {
    //     console.log('false');
    // }

const password = 'p@ss12';

if (password.length >= 12 && password.includes('@')) {
    console.log('that password is mighty strong');
} else if (password.length >= 8 || password.includes('@') && password.length > 5) {
    console.log('that password is strong enough');
} else {
    console.log('that password is not strong enough');
}

// break & continue
const scores = [50, 25, 0, 30, 100, 20, 10];

for (let i = 0; i < scores.length; i++) {

    if (scores[i] === 0) {
        continue;
    }

    console.log('your score:', scores[i]);

    if (scores[i] === 100) {
        console.log('congrats, you got the top score!');
        break;
    }

}

// switch statements
const grade = 'D';

switch (grade) {
    case 'A':
        console.log('you got an A!');
        break;
    case 'B':
        console.log('you got a B!');
        break;
    case 'C':
        console.log('you got a C!');
        break;
    case 'D':
        console.log('you got a D!');
        break;
    case 'E':
        console.log('you got an E!');
        break;
    default:
        console.log('not a valid grade');
}

// variables & block scope
let age = 30;

if (true) {

    // age = 40;
    let age = 40;
    let name = 'shaun';
    console.log('inside 1st code block:', age, name);

    if (true) {

        let age = 50;
        console.log('inside 2nd code block:', age, name);

    }

}

console.log('outside code block:', age, name);