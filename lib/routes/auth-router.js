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
/**
 * This route lets you create a user, with the user credentials in the request body
 * @route POST /signup-body
 * @group auth - operations for signup and signin
 * @param {string} username.body.required - This is the unique user's username
 * @param {string} password.body.required - The user's password
 * @param {string} fname.body - The user's first name
 * @param {string} lname.body - The user's last name
 * @returns {object} 201 - The created user object
 * @returns {object} 400 - If username is not unique
 * 
 */
router.post('/signup', async (req, res, next) => {
    // console.log(req);
    let presentUser = await UsersModel.readByQuery({username:req.body.username});
    if(presentUser.length ===0){
        // create a user from data in req.body
        let user = await UsersModel.create(req.body);
        res.status(201).send(user);
    }else{
        next({status:400, message:'Username has to be unique'});
    }

    
});

/**
 * This route validates and signs a user in
 * @route POST /signin
 * @group auth - operations for signup and signin
 * @returns {object} 200 - Success message
 */

router.post('/signin',auth,async (req, res, next) => {
    // get user data from encoded Basic Auth
       res.status(200).send('Success');
});

/**
 * This route gives you an array of all current users
 * @route GET /users
 * @group user
 * @returns {object} 200 - Array of users
 * @returns {object} 400 - No users
 */
router.get('/users', async(req,res,next)=> {
    let all = await UsersModel.read();
    if(all){

        res.status(200).send('All users'+ all);
    }else{
        res.status(400).send('No users');
    }
})
// Error Handling


// Exports
module.exports = router;
