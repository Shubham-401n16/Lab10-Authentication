'use strict';

// Esoteric Resources
const express = require('express');
const bcrypt = require('bcrypt');

// Internal Resources
const Model = require('../models/model.js');
const userSchema = require('../models/user-schema.js');

// Variables
const UsersModel = new Model(userSchema);
const router = express.Router();

const auth = require('../middleware/auth.js');
const errorHandler = require('../middleware/error-handler.js');
const notFoundHandler = require('../middleware/404.js');
router.use('/signin',auth);


// Routes
router.post('/signup', async (req, res, next) => {
    let presentUser = await UsersModel.readByQuery({username:req.body.username});
    if(!presentUser){

        // create a user from data in req.body
        let user = await UsersModel.create(req.body);
        res.send(user);
    }else{
        next({status:400, message:'Username has to be unique'});
    }

    
});

// router.post('/signup-headers', async (req, res, next) => {
//     // create a user from data in req.headers.authorization
//     let basicAuth = req.headers.authorization.split(' ');

//     if (basicAuth.length === 2 && basicAuth[0] === 'Basic') {
//         let userData = base64Decoder(basicAuth[1]);
//         let user = await UsersModel.create({ ...userData, ...req.body });
//         res.send(user);
//     }

//     res.end();
// });

router.post('/signin', async (req, res, next) => {
    // get user data from encoded Basic Auth
   if(req.auth){
       res.status(200).send('Success');
   }else{
       next({status: '401', message:'Unauthorized'});
   }
});

// Error Handling
app.use('*', notFoundHandler);
app.use(errorHandler);

// Exports
module.exports = router;
