require("../src/db/db_connect_mangoose");
const User = require("../src/models/user");


// User.findByIdAndUpdate("5ed695ce033f0031984609e7", { age: 23 }).then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 18 })
// }).then((ageCount) => {
//     console.log(ageCount);
// }).catch((er) => {
//     console.log(er);
// })


const userUpdateAndCount = async(id, age) => {
    console.log(age);
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return count
}

userUpdateAndCount("5edba583aa227627ec10abc6", 10).then((count) => {
    console.log(count);
}).catch((er) => {
    console.log(er);
})