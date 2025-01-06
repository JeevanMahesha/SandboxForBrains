// object literals

let user = {
    name: 'crystal',
    age: 30,
    email: 'crystal@thenetninja.co.uk',
    location: 'berlin',
    blogs: ['why mac & cheese rules', '10 things to make with marmite'],
    logBlogs() {
        // access the blogs here
        // console.log(this);
        console.log('this user has written these blogs:');
        this.blogs.forEach(blog => {
            console.log(`${blog.title} has ${blog.likes} likes`);
        })
    }
};

// console.log(user);
// console.log(user.age);

// user.age = 35;
// console.log(user.age);

// console.log(user['name']);
// user['name'] = 'chun-li';
// console.log(user['name']);

// console.log(typeof user);
// user.logBlog()

// Math object

console.log(Math);
console.log(Math.PI);
console.log(Math.E);

const area = 7.7;

console.log(Math.round(area));
console.log(Math.floor(area));
console.log(Math.ceil(area));
console.log(Math.trunc(area));

// random numbers

const random = Math.random();

console.log(random);
console.log(Math.round(random * 100));