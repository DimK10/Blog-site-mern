const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Multer is for handling multipart/form-data
// in order to be able to use express-validator for validation
// multer settings - image will be base64 encoded and retrieved via req.files[0].buffer
const multer = require('multer');
let storage = multer.memoryStorage();
let upload = multer({ storage: storage });

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

const { createAttachment } = require('../middlewares');

router.post(
    '/signup',
    upload.single('avatar'),
    userSignupValidator,
    createAttachment,
    signup
);
// TODO - maybe remove signin?
router.post('/auth', findUser, signin);
router.post('/signin', userSigninValidator, signin);
router.get('/signout', signout);

module.exports = router;
