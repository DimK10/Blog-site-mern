const User = require('../models/user');
const jwt =require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');


exports.signup = (req, res) => {

    console.log('req.body', req.body);
    const user = new User(req.body);
    user.save((err, user) => {
        if(err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        };

        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({ user });
    });
};

// TODO signin
