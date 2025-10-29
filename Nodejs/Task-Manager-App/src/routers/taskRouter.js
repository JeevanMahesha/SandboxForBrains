const express = require("express")
const auth = require("../middleware/auth")
const Task = require("../models/taskModel")
const router = new express.Router()
const multer = require("multer")

const uploadDoc = (multer({
    dest: 'Doc',
    limits: {
        fileSize: 500000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(doc|docx|pdf)$/)) {
            return cb(new Error("Please Upload doc only"))
        }
        cb(undefined, true)
    }
}))

router.post("/tasks/upload", uploadDoc.single("document"), (req, res) => {
    res.send()
}, (e, req, res, next) => {
    res.status(400).send({ "Error": e.message })
})

router.post("/tasks", auth, async(req, res) => {
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})

router.patch("/tasks/:id", auth, async(req, res) => {
    const taskdata = Object.keys(req.body)
    const allowdata = ["description", "completion"]
    const isValidData = taskdata.every((data) => allowdata.includes(data))
    if (!isValidData) {
        return res.status(400).send({ error: "invalid input" })
    }
    try {
        const taskupdate = await Task.findOne({ _id: req.params.id, 'owner': req.user._id })
        if (!taskupdate) {
            return res.status(404).send("Task not found")
        }
        taskdata.forEach(data => taskupdate[data] = req.body[data])
        await taskupdate.save()
        res.send(taskupdate)
    } catch (e) {
        res.status(500).send(e)
    }
})



router.delete("/tasks/:id", auth, async(req, res) => {
    try {
        const taskdelete = await Task.findByIdAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!taskdelete) {
            return res.status(404).send("Task not found to delete")
        }
        res.send(taskdelete)
    } catch (e) {
        res.status(500).send(e)
    }
})


//GET /tesk?completion=true || flase
// limit=10&skip=0 
router.get("/tasks", auth, async(req, res) => {
    const match = {}
    if (req.query.completion) {
        match.completion = req.query.completion === 'true'
    }
    try {
        const task = await req.user.populate({
            path: 'usertasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        }).execPopulate()
        if (!task) {
            return res.status(404).send("No Task")
        }
        res.send(task.usertasks)
    } catch (e) {
        res.status(500).send(e)
    }
    // Task.find({}).then((tasks) => {
    //     if (!tasks) {
    //         return res.status(404).send()
    //     }
    //     res.send(tasks)
    // }).catch((er) => {
    //     res.status(500).send(er)
    // })
})

router.get("/tasks/:id", auth, async(req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, 'owner': req.user._id })
        if (!task) {
            return res.status(404).send("Not found")
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
    // Task.findById(_id).then((task) => {
    //     if (!task) {
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((er) => {
    //     res.status(500).send()
    // })
})


module.exports = router