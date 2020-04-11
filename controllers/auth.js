const formidable = require('formidable');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('config');
const { errorHandler } = require('../helpers/dbErrorHandler');
const { validationResult } = require('express-validator');
const { createReadStream } = require('fs');

const stream = require('stream');

const User = require('../models/user');

// TODO - Remove dotenv -- using config now

const findUser = (req, res, next) => {
    const token = req.header('authorization')
        ? req.header('authorization').replace('Bearer ', '')
        : null;

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    // Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtsecret'));

        req.profile = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

async function signup(req, res) {
    try {
        // See if user exists
        user = await User.findOne({ email: req.body.email });

        if (user) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'User already exists' }] });
        }

        // Check for all fields

        let { name, email, password, about = '' } = req.body;
        let interests = JSON.parse(req.body.interests);
        let photo = req.file;
        let avatarId = null;

        // Check if there is a photo
        if (photo) {
            const Attachment = req.Attachment;

            // Write image to gridFS
            // for photo i need path
            // const readStream = createReadStream(photo.orinalname);
            const readStream = new stream.PassThrough();
            readStream.end(photo.buffer);

            const options = {
                filename: name,
                contentType: photo.type,
            };

            await Attachment.write(options, readStream, async (err, file) => {
                // Either Attacchment.write is buggy, or im cant code
                // Cant get any value using await like
                // const result = await Attachment.write(...)
                // so i ll stick with this code block, so that i can save avatarId
                if (err) {
                    console.error(err.message);
                    res.status(500).json({
                        msg: "Can't upload profile image",
                    });
                    return;
                }

                // Save photo id to user
                avatarId = file._id.toString();
                // TODO - Add promote user to admin
                user = new User({
                    name,
                    email,
                    password,
                    avatarId,
                    about,
                    interests,
                    role: 0,
                });

                await user.save();

                // Return jsonwebtoken
                let payload = {
                    user: {
                        id: user.id,
                    },
                };

                // TODO - Reduce time of expiresIn
                const token = await jwt.sign(payload, config.get('jwtsecret'), {
                    expiresIn: 360000,
                });

                user.salt = undefined;
                user.hashed_password = undefined;

                return res.json({ token, user: user.id });
            });
            return;
        }

        // TODO - Add promote user to admin
        user = new User({
            name,
            email,
            password,
            avatarId,
            about,
            interests,
            role: 0,
        });

        await user.save();

        // Return jsonwebtoken
        let payload = {
            user: {
                id: user.id,
            },
        };

        // TODO - Reduce time of expiresIn
        const token = jwt.sign(
            payload,
            config.get('jwtsecret'),
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

        user.salt = undefined;
        user.hashed_password = undefined;

        return res.json({ token, user: user.id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

async function signin(req, res) {
    const { email, password } = req.body;

    try {
        if (req.profile) {
            // Check if there is a user found from a provided Token
            let user = await User.findById(req.profile.id).select(
                '-salt -hashed_password'
            );
            // User is already authenticated
            return res.json(user);
        }

        let user = await User.findOne({ email }).select(
            '+salt +hashed_password'
        );

        // console.log('user object ', user);

        if (!user) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid credentials' }] });
        }

        if (!user.authenticate(password)) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid credentials' }] });
        }

        // Return jsonwebtoken
        let payload = {
            user: {
                id: user.id,
            },
        };

        // TODO - Change expiresIn value
        const token = jwt.sign(payload, config.get('jwtsecret'), {
            expiresIn: 360000,
        });

        return res.json({ token, user: user.id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
// exports.signin = (req, res) => {
//     // Find user based on email
//     const { email, password } = req.body;
//     User.findOne({ email })
//         .select('+salt +hashed_password')
//         .exec((err, user) => {
//             if (err || !user) {
//                 return res.status(400).json({
//                     err: 'User with that email does not exist. Please signup',
//                 });
//             }

//             // If user is found make sure the email and password match
//             // create authenticate method in user model
//             if (!user.authenticate(password)) {
//                 return res.status(401).json({
//                     err: 'Email and password dont match',
//                 });
//             }

//             //Check if cookie session exists
//             if (req.cookies.t) {
//                 // Cookie with t exists -- user is already signed in
//                 // Ths same user is trying to sign in again
//                 if (req.cookies.t.username === user.name) {
//                     return res.status(409).json({
//                         err: 'You are already signed in',
//                     });
//                 }
//             }
//             // console.log('user.id in signin ', user.id);
//             // Generate a signed token with user id and secret
//             const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

//             // Persist the token as 't' in cookie with expiry date
//             res.cookie('t', { username: user.name, expire: new Date() + 9999 });

//             // Return response with user and token to frontend client
//             const { _id, name, email, role } = user;
//             return res.json({ token, user: { _id, name, email, role } });
//         });
// };

const signout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: 'Sign out successful' });
};

const requireSignin = expressJwt({
    credentialsRequired: true,
    secret: config.get('jwtsecret'),
    userProperty: 'auth',
});

const isAuth = (req, res, next) => {
    // console.log('req.auth ', req.auth);
    // console.log('req.profile.id ', req.profile._id);
    // console.log('req.auth.id ', req.auth.id);
    // console.log('req.profile ', req.profile);

    let user = req.profile && req.auth && req.profile._id == req.auth.id;
    if (!user) {
        return res.status(403).json({
            err: 'Access Denied',
        });
    }
    next();
};

const isAdmin = (req, res, next) => {
    console.log('req.auth ', req.auth);
    User.findById(req.auth.id).exec((err, userInSession) => {
        if (err) {
            return res.status(500).json({
                err: 'Cannot find user authenticated by id',
            });
        }

        console.log('userInSession ', userInSession);

        if (userInSession.role !== 1) {
            return res.status(403).json({
                err: 'Admin resource! Access denied',
            });
        }
        next();
    });
};

const isAllowedToDeleteCategory = (req, res, next) => {
    const category = req.category;
    const profile = req.profile;
    console.log('category ', category);
    console.log('profile', profile);
    // console.log('profile._id !== category.createdFrom) || profile.role != 1 ', (profile._id !== category.createdFrom) || profile.role != 1);

    if (String(profile._id) !== String(category._createdFrom._id)) {
        if (profile.role !== 1) {
            // User is not allowed to delete this category and also not admin user
            return res.status(400).json({
                err:
                    "You haven't created this category, therefore you can't delete it",
            });
        } else {
            // User is admin, he is allowed to delete
            req.isAllowed = true;
        }
    } else {
        req.isAllowed = true;
    }
    next();
};

const isAllowed = ({ type }) => (req, res, next) => {
    const profile = req.profile;

    switch (type) {
        case 'post':
            const post = req.post;

            if (String(profile._id) !== String(post.author._id)) {
                if (profile.role !== 1) {
                    // User is not allowed to delete this category and also not admin user
                    return res.status(400).json({
                        err:
                            "You haven't created this post, therefore you can't update or delete it",
                    });
                }
            }

            req.isAllowed = true;
            next();
            break;

        case 'comment':
            const comment = req.comment;
            console.log('comment ', comment);
            console.log('profile', profile);
            // console.log('profile._id !== post.author) || profile.role != 1 ', (profile._id !== post.author) || profile.role != 1);

            if (String(profile._id) !== String(comment._userId._id)) {
                if (profile.role !== 1) {
                    // User is not allowed to delete this category and also not admin user
                    return res.status(400).json({
                        err:
                            "You haven't created this comment, therefore you can't update or delete it",
                    });
                }
            }

            req.isAllowed = true;
            next();
            break;

        case 'reply':
            const reply = req.reply;

            if (String(profile._id) !== String(reply._userId._id)) {
                if (profile.role !== 1) {
                    // User is not allowed to delete this category and also not admin user
                    return res.status(400).json({
                        err:
                            "You haven't created this reply, therefore you can't update or delete it",
                    });
                }
            }

            req.isAllowed = true;
            next();
            break;

        default:
            break;
    }
};

module.exports = {
    findUser,
    signin,
    signup,
    signout,
    requireSignin,
    isAdmin,
    isAuth,
    isAllowed,
};
