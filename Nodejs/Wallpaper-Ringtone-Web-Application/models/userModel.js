const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validator(value) {
            if (validator.isEmail(value)) {
                throw new Error("Invalid E-mail Address")
            }
        }
    },
    mobile: {
        type: Number,
        required: true,
        trim: true,
        validator(value) {
            if (value < 0 || value > 10) {
                throw new Error("Invalid Mobile Number")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("Password contain word password")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('userImage', {
    ref: 'images',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('userRingtone', {
    ref: 'ringtone',
    localField: '_id',
    foreignField: 'owner'
})


userSchema.methods.toJSON = function() {
    const userObject = this.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({ _id: this._id.toString() }, 'Wallpaper')
    this.tokens = this.tokens.concat({ token })
    await this.save()
    return token
}

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await Users.findOne({ email })
    if (!user) {
        throw new Error("User Not Found")
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("Login Failed Please Check the E-mail and Password")
    }
    return user
}


userSchema.pre('save', async function() {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
})

const Users = mongoose.model('Users', userSchema)

module.exports = Users