'use strict';

const Model = require('../models/model.js');
const schema = require('../models/user-schema.js');
const UserModel = new Model(schema);

/**
 * A function that takes a base64 encoded string of the
 * format username:password, and returns an object with
 * those key-values in plaintext
 * @function
 * @param {string} encodedString - the base64 encoded username:password
 * @return {object} data - The decoded user data of the format {username, password}
 */

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

/**
 * Takes in a username and password, and tries to find an
 * existing user that matches that content
 * @function
 * @param {object} userData - An object of the format {username, password}
 * @return {object} possibleUser - A user record from the DB
 * @return {object} userData - The unchanged params
 */

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

/**
 * Auth middleware that finds a user based on credentials
 * @function
 * @param {string} req.headers.authorization - a string with Basic or Bearer credentials
 * @return {object} req.user - The found user, or user credentials
 * @throws {Error} 401 - The user does not exist / some auth error
 */

const authentication = async (req, res, next) => {
    // Splits the req.headers.authorization string into two pieces
    // Typically ["Basic", encoding] or ["Bearer", token]
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
            // Use JWT Verify (via UsersModel.verifyToken) to ensure
            // that the token is valid (not expired, tampered with, wrong)
     
            let tokenData = UserModel.verifyToken(authPieces[1]);
            // tokenData should now be data encrypted in the token,
            // (in our case { _id } check that this is true
            // (otherwise perhaps tokenData is null/empty))
            if(tokenData && tokenData._id){
              // Use the _id stored in tokenData to find the full
              // user record. Set this as req.user
                req.user = await UserModel.read(tokenData._id);
            }
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