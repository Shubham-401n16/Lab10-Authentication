'use strict';

const bcrypt = require('bcrypt');
const Model = require('../models/model.js');
const schema = require('../models/user-schema.js');
const UserModel = new Model(schema);

const base64Decoder = (encodedString) => {
    let data = {
        username: '',
        password: '',
    };

    // base64(username + ':' + password)

    let decodedString = Buffer.from(encodedString, 'base64').toString();
    let dataPieces = decodedString.split(':');

    data.username = dataPieces[0];
    data.password = dataPieces[1];

    return data;
};

const authentication = async(req,res,next) => {
    let basicAuth = req.headers.authorization.split(' ');

    if (basicAuth.length === 2 && basicAuth[0] === 'Basic') {
        let userData = base64Decoder(basicAuth[1]);

        let possibleUsers = await UserModel.readByQuery({
            username: userData.username,
        });

        for (let i = 0; i < possibleUsers.length; i++) {
            let isSame = await bcrypt.compare(
                userData.password,
                possibleUsers[i].password,
            );

            if (isSame) {
                req.user = possibleUsers[i];
                break;
            }
        }

        if (req.user) {
            res.status(200);
            res.send('found!');
        } else {
            next({ status: 401, message: 'Unauthorized' });
        }
    }
    res.end();
};

module.exports = authentication;