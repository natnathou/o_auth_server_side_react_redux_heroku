const mongoose = require("mongoose")
const crypto   = require('crypto')
const Schema   = mongoose.Schema

const userSchema = new Schema({
    username  : Object,
    password  : String,
    provider  : Object,
    idProvider: Object,
    name      : Object,
    email     : Object,
    token     : String,
    hash      : String,
    salt      : String,
    iv        : String
})

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 100000, 512, 'sha512').toString('hex');
};

userSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 100000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

const User = mongoose.model("user", userSchema)

module.exports = User;