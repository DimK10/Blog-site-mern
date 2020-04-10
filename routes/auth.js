const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const {
    findUser,
    signup,
    signin,
    signout,
    requireSignin,
} = require('../controllers/auth');

const {
    userSignupValidator,
    userSigninValidator,
} = require('../validator/userValidator');

router.post('/signup', userSignupValidator, signup);
// TODO - maybe remove signin?
router.post('/auth', findUser, signin);
router.post('/signin', userSigninValidator, signin);
router.get('/signout', signout);

module.exports = router;
