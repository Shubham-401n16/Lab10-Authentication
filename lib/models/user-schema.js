'use strict';

require('dotenv').config;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const schema = mongoose.Schema({
    username: { type: 'String', unique: true, required: true },
    password: { type: 'String', required: true },
    email: { type: 'String' },
    role: {type: 'String', required: true, default: 'user', enum: ['admin', 'editor', 'user']}
});

schema.pre('save', async function () {
    // hash the password EVERY TIME we try to create a user
    this.password = await bcrypt.hash(this.password, 10);
});

schema.methods.generateToken = function () {
    let timeout = Date.now() + 5000000;

    console.log('SECRET',process.env.SECRET)
    //return jwt.sign({ _id: this._id }, process.env.SECRET);
    return jwt.sign({ _id: this._id }, 'Iamafoodie');

    // return jwt.sign(
    //     { exp: timeout, data: { _id: this._id } },process.env.SECRET,
    // );
};

schema.methods.comparePasswords = async function (plainTextPass) {
    return await bcrypt.compare(plainTextPass, this.password);
};

schema.statics.verifyToken = function (token) {
    //let tokenContents = jwt.verify(token, process.env.SECRET);
    let tokenContents = jwt.verify(token, 'Iamafoodie');
    return tokenContents.data;
};

module.exports = mongoose.model('users', schema);
