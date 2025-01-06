const Users = require("../models/userModel")
const express = require("express")
const auth = require("../middleware/auth")
const router = new express.Router()
const { sendWelcomeMail } = require("../middleware/Mailer")

router.post("/user/signup", async(req, res) => {
    const user = new Users(req.body)
    try {
        await user.save()
        sendWelcomeMail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token, status: 201 })
    } catch (e) {
        res.status(400).send({ Error: 'Signup Failed', status: 400 })
    }
})

router.post("/users/login", async(req, res) => {
    try {
        const user = await Users.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token, status: 200 })
    } catch (e) {
        res.status(400).send({ "error": e.message, "status": 400 })
    }
})

router.post("/users/logout", auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send({ 'message': "logout successfully" })
    } catch (e) {
        res.status(500).send({ "message": "logout failed" })
    }
})

router.get("/users/me", auth, async(req, res) => {
    res.send(req.user)
})

router.get("/users/:id", auth, async(req, res) => {
    try {
        const user = await Users.findById({ _id: req.params.id })
        if (!user) {
            res.status(404).send({ "Error": "User Not Found" })
        }
        res.send(user)
    } catch (e) {
        res.status(500).send({ "Error": e })
    }
})

module.exports = router