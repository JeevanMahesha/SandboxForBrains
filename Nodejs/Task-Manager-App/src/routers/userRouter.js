const express = require("express")
const User = require("../models/userModel")
const auth = require("../middleware/auth")
const router = new express.Router()
const multer = require("multer")

const upload = multer({
    limits: {
        fileSize: 5000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error("Please Upload only image"))
        }
        cb(undefined, true)
    }
})


router.post("/users/me/upload", auth, upload.single("avater"), async(req, res) => {
    req.user.avater = req.file.buffer
    await req.user.save()
    res.send()
}, (e, req, res, next) => {
    res.status(400).send({ "Error": e.message })
})

router.delete("/users/me/upload", auth, async(req, res) => {
    req.user.avater = undefined
    await req.user.save()
    res.send()
})

router.get("/users/:id/avater", async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avater) {
            throw new Error("User not Found")
        }
        res.set("Content-Type", 'image/jpg')
        res.send(user.avater)
    } catch (e) {
        res.status(404).send(e.message)
    }
})

router.post("/users", async(req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e.message)
    }
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })
})

router.post("/users/login", async(req, res) => {
    try {
        const userLogin = await User.findByCredentials(req.body.email, req.body.password)
        const token = await userLogin.generateAuthToken()
        res.send({ userLogin, token })
    } catch (e) {
        res.status(400).send({ "Error": e.message })
    }
})

router.post("/users/logout", auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send({ 'message': "logout successfully" })
    } catch (e) {
        res.status(500).send({ "message": "logout failed" })
    }
})

router.post("/users/logoutall", auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send({ 'message': "logout successfully From all devices" })
    } catch (e) {
        res.status(500).send({ "message": "logout failed" })
    }
})

router.patch("/users/me", auth, async(req, res) => {
    const userdata = Object.keys(req.body)
    const allowdata = ["name", "email", "age"]
    const isValidData = userdata.every((data) => allowdata.includes(data))
    if (!isValidData) {
        return res.status(400).send({ error: "invalid Input" })
    }
    try {

        userdata.forEach(data => req.user[data] = req.body[data]);
        await req.user.save()
            //const userUpdate = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete("/users/me", auth, async(req, res) => {
    try {
        // const userdelete = await User.findByIdAndDelete(req.params.id)
        // if (!userdelete) {
        //     return res.status(404).send({ "error": "user not found to delete" })
        // }
        await req.user.remove()
        res.send({ "success": req.user })
    } catch (e) {
        res.status(500).send("server error")
    }
})

router.get("/users/me", auth, async(req, res) => {
    res.send(req.user)
})

router.get("/users", async(req, res) => {
    //res.send(req.user)
    try {
        const user = await User.find({})
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send(e)
    }

    User.find({}).then((users) => {
        res.send(users)
    }).catch(() => {
        res.status(500).send()
    })
})

// router.get("/users/:id", async(req, res) => {
//     const _id = req.params.id
//     try {
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send("User not found")
//         }
//         res.send(user)
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })

module.exports = router