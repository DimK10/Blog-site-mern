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

exports.signin = (req, res) => {
    // Find user based on email
    const { email, password } = req.body;
    User.findOne({ email },(err, user) => {
        if(err || !user) {
            return res.status(400).json({
                err: 'User with that email does not exist. Please signup'
            })
        };

        // If user is found make sure the email and password match
        // create authenticate method in user model
        if(!user.authenticate(password)) {
            res.status(401).json({
                err: 'Email and password dont match'
            })
        }

        //Check if cookie session exists
        console.log('cookies:', req.cookies);
        if(req.cookies.t) {
            // Cookie with t exists -- user is already signed in 
            // Ths same user is trying to sign in again
            if(req.cookies.t.username === user.name) {
                return res.status(409).json({
                    err: 'You are already signed in'
                })
            };
        };
        // console.log('user.id in signin ', user.id);
        // Generate a signed token with user id and secret
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)

        // Persist the token as 't' in cookie with expiry date
        res.cookie('t', { username: user.name, expire: new Date() + 9999 });


        // Return response with user and token to frontend client
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, name, email, role }});


    });
};

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: 'Sign out successful' });
};

exports.requireSignin = expressJwt({
    credentialsRequired: true,
    secret: process.env.JWT_SECRET,
    userProperty: 'auth'
});


exports.isAuth = (req, res, next) => {
    // console.log('req.auth ', req.auth);
    // console.log('req.profile.id ', req.profile._id);
    // console.log('req.auth.id ', req.auth.id);
    // console.log('req.profile ', req.profile);

    let user = req.profile && req.auth && req.profile._id == req.auth.id
    if(!user) {
        return res.status(403).json({
            err: 'Access Denied'
        });
    };
    next();
};

exports.isAdmin = (req, res, next) => {
    console.log('req.auth ', req.auth);
    User.findById(req.auth.id).exec((err, userInSession) => {
        if(err) {
            return res.status(500).json({
                err: 'Cannot find user authenticated by id'
            })
        };

        console.log('userInSession ', userInSession);

        if(userInSession.role !== 1) {
            return res.status(403).json({
                err: 'Admin resource! Access denied'
            });
        };
        next();
    })
};

exports.isAllowedToDeleteCategory = (req, res, next) => {
    const category = req.category;
    const profile = req.profile;
    console.log('category ', category);
    console.log('profile', profile);
    // console.log('profile._id !== category.createdFrom) || profile.role != 1 ', (profile._id !== category.createdFrom) || profile.role != 1);

    if((String(profile._id) !== String(category._createdFrom._id))) {
        if(profile.role !== 1) {
            // User is not allowed to delete this category and also not admin user
            return res.status(400).json({
                err: 'You haven\'t created this category, therefore you can\'t delete it'
            });
        } else {
            // User is admin, he is allowed to delete
            req.isAllowed = true;
        };
    }else {
        req.isAllowed = true;
    };
    next();
};

// exports.isAllowedToDeletePost = (req, res, next) => {
//     const post = req.post;
//     const profile = req.profile;
//     // console.log('post ', post);
//     // console.log('profile', profile);
//     // console.log('profile._id !== post.author) || profile.role != 1 ', (profile._id !== post.author) || profile.role != 1);
    
//     if(String(profile._id) !== String(post.author._id)) {
//         if(profile.role !== 1) {
//             // User is not allowed to delete this category and also not admin user
//             return res.status(400).json({
//                 err: 'You haven\'t created this post, therefore you can\'t delete it'
//             });
//         } else {
//             // User is admin, he is allowed to delete
//             req.isAllowed = true;
//         };
//     } else {
//         req.isAllowed = true;
//     }
//     next();
// };

// exports.isAllowedToDeleteComment = (req, res, next) => {
//     const comment = req.comment;
//     const profile = req.profile;
//     // console.log('comment ', comment);
//     // console.log('profile', profile);
//     // console.log('profile._id !== post.author) || profile.role != 1 ', (profile._id !== post.author) || profile.role != 1);
    
//     if(String(profile._id) !== String(comment._userId._id)) {
//         if(profile.role !== 1) {
//             // User is not allowed to delete this category and also not admin user
//             return res.status(400).json({
//                 err: 'You haven\'t created this post, therefore you can\'t delete it'
//             });
//         };
//     } else {
//         req.isAllowed = true;
//     };

//     req.isAllowed = true;
//     next();
// };

exports.isAllowedToDeleteReply = () => {
    
};

// TODO 
// Create isAllowed for update methods

// Test 
// Create a higher order function that takes two parameters: 1 type of action
// the user want to do, and 2 the action itself etc type: 'comment', action: 'delete'
// This is done to reduce the amount of middleware functions needed to be made in order
// to check if the user wrote the comment, post or reply, or if he/she is the admin, and based on those
// if he/she is allowed to perform the action he/she requests

exports.isAllowed = ({ type, action }) => (req, res, next) => {

    const profile = req.profile;

    switch (action) {
        case 'update':
            // Check for type
            switch (type) {
                case 'post':
                    
                    break;
                
                case 'comment':
                
                    break;

                case 'reply':
                
                    break;
            
                default:
                    return res.status(400).json({
                        err: 'The action to perform is not defined, of not defined properly. Check route'
                    });
            }
        case 'delete':
            
            // Check for type
            switch (type) {

                case 'post':
                    const post = req.post;
                    // console.log('post ', post);
                    // console.log('profile', profile);
                    // console.log('profile._id !== post.author) || profile.role != 1 ', (profile._id !== post.author) || profile.role != 1);
                    
                    if(String(profile._id) !== String(post.author._id)) {
                        if(profile.role !== 1) {
                            // User is not allowed to delete this category and also not admin user
                            return res.status(400).json({
                                err: 'You haven\'t created this post, therefore you can\'t delete it'
                            });
                        } else {
                            // User is admin, he is allowed to delete
                            req.isAllowed = true;
                        };
                    } else {
                        req.isAllowed = true;
                    }
                    next();
                    break;

                case 'comment': // first test case
                    const comment = req.comment;
                    console.log('comment ', comment);
                    console.log('profile', profile);
                    // console.log('profile._id !== post.author) || profile.role != 1 ', (profile._id !== post.author) || profile.role != 1);
                    
                    if(String(profile._id) !== String(comment._userId._id)) {
                        if(profile.role !== 1) {
                            // User is not allowed to delete this category and also not admin user
                            return res.status(400).json({
                                err: 'You haven\'t created this comment, therefore you can\'t delete it'
                            });
                        };
                    } else {
                        req.isAllowed = true;
                    };
                
                    req.isAllowed = true;
                    next();
                    break;
                
                case 'reply':
                    const reply = req.reply;
                    console.log('reply ', reply);
                    console.log('profile', profile);
                    // console.log('profile._id !== post.author) || profile.role != 1 ', (profile._id !== post.author) || profile.role != 1);
                    
                    if(String(profile._id) !== String(reply._rootId._id)) {
                        if(profile.role !== 1) {
                            // User is not allowed to delete this category and also not admin user
                            return res.status(400).json({
                                err: 'You haven\'t created this reply, therefore you can\'t delete it'
                            });
                        };
                    } else {
                        req.isAllowed = true;
                    };
                
                    req.isAllowed = true;
                    next();
                    break;
                
                case 'category':
                    const category = req.category;
                    console.log('category ', category);
                    console.log('profile', profile);
                    // console.log('profile._id !== category.createdFrom) || profile.role != 1 ', (profile._id !== category.createdFrom) || profile.role != 1);

                    if((String(profile._id) !== String(category._createdFrom._id))) {
                        if(profile.role !== 1) {
                            // User is not allowed to delete this category and also not admin user
                            return res.status(400).json({
                                err: 'You haven\'t created this category, therefore you can\'t delete it'
                            });
                        } else {
                            // User is admin, he is allowed to delete
                            req.isAllowed = true;
                        };
                    }else {
                        req.isAllowed = true;
                    };
                    next();
                    break;

                default:
                    return res.status(400).json({
                        err: 'The action to perform is not defined, of not defined properly. Check route'
                    });
            };
            // action switch break
            break;
    
        default:
            return res.status(400).json({
                err: 'The Type of action to perform is not defined, of not defined properly. Check route'
            });
    }
}
