const express = require ('express');
const router = express.Router ();

const { commentById } = require('../controllers/comment');

const {
  replyById,
  createToComment,
  createToReply,
  update,
  remove,
} = require ('../controllers/reply');

const {requireSignin, isAllowed, isAuth} = require ('../controllers/auth');

const {userById} = require ('../controllers/user');

router.post (
  '/reply/create-to-comment/:commentId/:userId',
  requireSignin,
  isAuth,
  createToComment
);

router.post (
  '/reply/create-to-reply/:replyId/:userId',
  requireSignin,
  isAuth,
  createToReply
);

router.put (
  '/reply/update/:replyId',
  requireSignin,
  isAuth,
  isAllowed ({type: 'reply', action: 'update'})
);

router.delete (
  '/reply/delete/:replyId/:userId',
  requireSignin,
  isAuth,
  isAllowed ({type: 'reply', action: 'delete'}),
  remove
);

router.param('commentId', commentById);
router.param('replyId', replyById);
router.param('userId', userById);

module.exports = router;
