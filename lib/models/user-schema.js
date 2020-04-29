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

schema.pre('find', function () {
    // "this" >> refers to the query
    //console.log('Pre Find >>', this);
});

schema.methods.generateToken = function () {
    let timeout = Math.floor(Date.now()/1000) + 5000000;

    console.log('SECRET',process.env.SECRET)
    //return jwt.sign({ _id: this._id }, process.env.SECRET);
    //return jwt.sign({ _id: this._id }, 'Iamafoodie');

    return jwt.sign(
        { exp: timeout, data: { _id: this._id } },process.env.SECRET,
    );
};

schema.methods.comparePasswords = async function (plainTextPass) {
    return await bcrypt.compare(plainTextPass, this.password);
};

schema.statics.verifyToken = function (token) {
    try{

        let tokenContents = jwt.verify(token, process.env.SECRET);
        //let tokenContents = jwt.verify(token, 'Iamafoodie');
        return tokenContents.data;
    }catch (e){
        console.log('EXPIRED OR INVALID!');
    }
    return {};
};

schema.statics.read = async function (_id) {
    // "this" >> refers to the model
    console.log('In statics read');
    let record = await this.findOne({ _id });
    console.log('Found record', record);
    return record;
};

module.exports = mongoose.model('users', schema);
