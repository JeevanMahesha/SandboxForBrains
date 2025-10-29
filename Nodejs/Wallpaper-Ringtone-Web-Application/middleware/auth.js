const Users = require("../models/userModel")
const jwt = require("jsonwebtoken")

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, 'Wallpaper')
        const user = await Users.findOne({ _id: decode._id, "tokens.token": token })
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ 'Error': 'Please Authorization' })
    }
}

module.exports = auth