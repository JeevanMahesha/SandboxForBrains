require("../src/db/db_connect_mangoose")
const Task = require("../src/models/task")

// Task.findByIdAndDelete("5ed89191f7cc4b346c039ad0").then(() => {
//     return Task.countDocuments({ completion: false })
// }).then((completionStatus) => {
//     console.log(completionStatus);
// }).catch((er) => {
//     console.log(er);
// })


const deleteTaskandCount = async(id, completion) => {
    const taskDelete = await Task.findByIdAndDelete(id)
    const taskCount = await Task.countDocuments({ completion })
    return taskCount
}

deleteTaskandCount("5edba7aa0e9fbf0384e7c3cb", false).then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);

})