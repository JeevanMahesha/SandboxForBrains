const ringtoneModel = require('../models/uploadringtone')

const auth = require("../middleware/auth")
const express = require("express")
const router = new express.Router()
const multer = require("multer")
const fs = require("fs")
const path = require("path")

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'audios')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const ringtoneUpload = multer({
    storage: storage,
    limits: {
        fileSize: 5000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(mp3|mp4)/)) {
            return cb(new Error("Please audio file Only"))
        }
        cb(undefined, true)
    }
})


router.post("/upload/ringtone", auth, ringtoneUpload.single('ringtone'), async(req, res) => {
    try {
        const ringtonefile = new ringtoneModel({
            ringtoneName: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            filetype: req.file.mimetype,
            owner: req.user._id
        })
        await ringtonefile.save()
        res.send({ "Message": "Upload successfully", "data": ringtonefile, status: 201 })
    } catch (error) {
        res.status(400).send(error.message)
    }
}, (error, req, res, next) => {
    res.status(400).send({ "message": error.message })
})

router.get("/ringtone/me", auth, async(req, res) => {
    try {
        const ringtone = await req.user.populate('userRingtone').execPopulate()
        if (!ringtone) {
            res.status(404).send('No ringtone Uploaded')
        }
        res.send(ringtone.userRingtone)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get("/ringtone/all", async(req, res) => {
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
        const ringtone = await ringtoneModel.find({})
        if (!ringtone) {
            res.status(404).send('No ringtone Uploaded')
        }
        res.send(ringtone)
    } catch (error) {
        res.status(500).send(error)
    }

})



module.exports = router