const express = require('express');
const router = express.Router();
const multer = require('multer');
let storage = multer.memoryStorage();
let upload = multer({ storage: storage });

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { postById } = require('../controllers/post');
const {
    userById,
    read,
    getAllUsers,
    update,
    resetUserPassword,
    readUserImg,
    getPostsWrittenByUser,
} = require('../controllers/user');

const { userSignupValidator } = require('../validator/userValidator');

const { createAttachment } = require('../middlewares');

router.get('/secret/:userId', requireSignin, isAdmin, (req, res) => {
    res.json({
        user: req.profile,
    });
});

router.put(
    '/user/reset-password/:userId',
    requireSignin,
    isAdmin,
    resetUserPassword
);

router.get('/user/:userId', requireSignin, read);
router.get('/users', requireSignin, getAllUsers);
router.get('/user/image/:userId', createAttachment, readUserImg);
router.get('/user/posts/:userId', requireSignin, isAuth, getPostsWrittenByUser);
router.put(
    '/user/:userId',
    requireSignin,
    isAuth,
    upload.single('avatar'),
    userSignupValidator,
    createAttachment,
    update
);

router.param('userId', userById);

module.exports = router;
