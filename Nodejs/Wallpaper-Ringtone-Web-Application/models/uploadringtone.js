const mongoose = require("mongoose")

ringtoneSchema = new mongoose.Schema({
    ringtoneName: {
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

const ringtoneModel = mongoose.model('ringtone', ringtoneSchema)

module.exports = ringtoneModel