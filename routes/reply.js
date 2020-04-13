const express = require('express');
const router = express.Router();

const { commentById } = require('../controllers/comment');

const {
    replyById,
    createReply,
    update,
    remove,
} = require('../controllers/reply');

const { requireSignin, isAllowed, isAuth } = require('../controllers/auth');

const { userById } = require('../controllers/user');

router.post('/reply/:commentId/:userId', requireSignin, isAuth, createReply);

router.put(
    '/reply/update/:replyId',
    requireSignin,
    isAuth,
    isAllowed({ type: 'reply' })
);

router.delete(
    '/reply/delete/:commentId/:replyId/:userId',
    requireSignin,
    isAuth,
    isAllowed({ type: 'reply' }),
    remove
);

router.param('commentId', commentById);
router.param('replyId', replyById);
router.param('userId', userById);

module.exports = router;
