'use strict';

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

const getUserFromCredentials = async (userData) => {
    let possibleUsers = await UserModel.readByQuery({
        username: userData.username,
    });

    for (let i = 0; i < possibleUsers.length; i++) {
        let isSame = possibleUsers[i].comparePasswords(userData.password);

        if (isSame) {
            return possibleUsers[i];
        }
    }
    return userData;
};

const authentication = async (req, res, next) => {
    let authPieces = req.headers.authorization.split(' ');

    // Check that authPieces has two parts: the type indicator ("Basic" or "Bearer"), the gibberish (encoded or encrypted)

    if (authPieces.length === 2) {
        if (authPieces[0] === 'Basic') {
            // authPieces[1] = base64(username:password)
            let authData = base64Decoder(authPieces[1]);
            // authData = { username, password }
            // check if that user exists, if so get user
            // otherwise leave req.user as { username, password }
            req.user = await getUserFromCredentials(authData);

            next();
            return;
        } else if (authPieces[0] === 'Bearer') {
            // authPieces[1] = token
            // verify that the token is legit
            // get a user from that token

            let tokenData = UserModel.verifyToken(authPieces[1]);
            req.user = await UserModel.read(tokenData._id);
            // To generate a new token after every request:
            //req.token = user.generateToken();
            next();
            return;
        }
    }

    next({ err: 401, msg: 'Missing correct authorization header' });
};

// const authentication = async(req,res,next) => {
//     let authPieces = req.headers.authorization.split(' ');

//      // Check that authPieces has two parts: the type indicator ("Basic" or "Bearer"), the gibberish (encoded or encrypted)

//      if (authPieces.length === 2) {
//         console.log('I am here');
//         if (authPieces[0] === 'Basic') {
           
//             let authData = base64Decoder(authPieces[1]);
//             let user = await UserModel.readByQuery({
//                 username: authData.username
//             });
//             req.user = await getUserFromCredentials(authData);

//             next();
//             return;
//         } else if (authPieces[0] === 'Bearer') {
//             let tokenData = UserModel.verifyToken(authPieces[1]);
//             req.user = await UserModel.read(tokenData._id);
//             next();
//             return;
//         }
//     }

//     next({ err: 401, msg: 'Missing correct authorization header' });

// };



module.exports = authentication;