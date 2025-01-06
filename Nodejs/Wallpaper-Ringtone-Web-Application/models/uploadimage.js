const mongoose = require("mongoose")

imageSchema = new mongoose.Schema({
    imageName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    filetype: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    }
}, {
    timestamps: true
})

const imageModel = mongoose.model('images', imageSchema)

module.exports = imageModel