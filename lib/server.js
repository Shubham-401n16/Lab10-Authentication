'use strict';

// Esoteric Resources
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

// Internal Resources

const authRouter = require('./routes/auth-router.js');
const Model = require('./models/model.js');
const schema = require('./models/user-schema.js');
const UserModel = new Model(schema);
//const generateSwagger = require('')


// Application-wide Middleware
const app = express();
//generateSwagger(app);

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Routes

app.get('/', (req, res, next) => {
    res.send('Homepage');
});

app.get('/users', async(req,res,next)=> {
    let all = await UserModel.read();
    res.status(200).send(all);
})

app.use(authRouter);

// Error Handling

// Exports
module.exports = {
    server: app,
    start: (port, mongodb_uri) => {
        app.listen(port, () => {
            console.log('Server is up and running on port', port);
        });

        // stuff to connect to MongoDB
        let options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        };

        mongoose.connect(mongodb_uri, options);
    },
};
