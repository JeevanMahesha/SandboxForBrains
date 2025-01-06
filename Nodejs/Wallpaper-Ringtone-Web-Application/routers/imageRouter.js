const imageModel = require('../models/uploadimage')

const auth = require("../middleware/auth")
const express = require("express")
const router = new express.Router()
const multer = require("multer")
const fs = require("fs")
const path = require("path")

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})


const imgaeUpload = multer({
    storage: storage,
    limits: {
        fileSize: 5000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)/)) {
            return cb(new Error("Please Upload Image file Only"))
        }
        cb(undefined, true)
    }
})


router.post("/upload/image", auth, imgaeUpload.single('image'), async(req, res) => {
    try {
        const imagefile = new imageModel({
            imageName: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            filetype: req.file.mimetype,
            owner: req.user._id
        })
        await imagefile.save()
        res.send({ "Message": "Upload successfully", "data": imagefile, status: 201 })
    } catch (error) {
        res.status(400).send(error.message)
    }
}, (error, req, res, next) => {
    res.status(400).send({ "message": error.message })
})

router.get("/images/me", auth, async(req, res) => {
    try {
        const image = await req.user.populate('userImage').execPopulate()
        if (!image) {
            res.status(404).send('No Image Uploaded')
        }
        res.send(image.userImage)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get("/images/all", async(req, res) => {
    // imgpath = path.join(path.join(__dirname, '../'), 'images')
    // fs.readdir(imgpath, function(err, files) {
    //     if (err) {
    //         return console.log('Unable to scan directory: ' + err);
    //     }
    //     files.forEach(function(file) {
    //         console.log(imgpath + "\\" + file);
    //     });
    // });
    try {
        const image = await imageModel.find({})
        if (!image) {
            res.status(404).send('No Image Uploaded')
        }
        res.send(image)
    } catch (error) {
        res.status(500).send(error)
    }

})



module.exports = router