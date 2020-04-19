'use strict';

// Esoteric Resources
const express = require('express');

// Internal Resources
const Model = require('../models/model.js');
const userSchema = require('../models/user-schema.js');


// Variables
const UsersModel = new Model(userSchema);
const router = express.Router();

const auth = require('../middleware/auth.js');
router.use('/signin',auth);


// Routes
router.post('/signup', async (req, res, next) => {
    // console.log(req);
    let presentUser = await UsersModel.readByQuery({username:req.body.username});
    if(presentUser.length ===0){
        // create a user from data in req.body
        let user = await UsersModel.create(req.body);
        res.send(user);
    }else{
        next({status:400, message:'Username has to be unique'});
    }

    
});

router.post('/signin',auth,async (req, res, next) => {
    // get user data from encoded Basic Auth
       res.status(200).send('Success');
});

router.get('/users', async(req,res,next)=> {
    let all = await UsersModel.read();
    if(all){

        res.status(200).send('All users'+ all);
    }else{
        res.send('No users');
    }
})
// Error Handling


// Exports
module.exports = router;
