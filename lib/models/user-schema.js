'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = mongoose.Schema({
    username: { type: 'String', unique: true, required: true },
    password: { type: 'String', required: true },
    fname: { type: 'String' },
    lname: { type: 'String' },
});

schema.pre('save', async function () {
    // hash the password EVERY TIME we try to create a user
    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('users', schema);
