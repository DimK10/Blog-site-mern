const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const {
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
router.post('/signin', userSigninValidator, signin);
router.get('/signout', signout);

module.exports = router;
