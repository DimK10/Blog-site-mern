const express = require ('express');
const router = express.Router ();

const {postById} = require ('../controllers/post');

const {
  commentById,
  create,
  update,
  remove,
} = require ('../controllers/comment');

const {
  requireSignin,
  isAllowedToDeleteComment,
  isAuth,
  isAllowed,
} = require ('../controllers/auth');

const {userById} = require ('../controllers/user');

router.post ('/comment/create/:postId/:userId', requireSignin, isAuth, create);

router.put (
  '/comment/update/:commentId',
  requireSignin,
  isAuth,
  isAllowed ({type: 'comment', action: 'update'}),
  update
);

router.delete (
  '/comment/delete/:commentId/:userId',
  requireSignin,
  isAuth,
  // isAllowedToDeleteComment,
  isAllowed ({type: 'comment'}),
  remove
);

router.param ('postId', postById);
router.param ('userId', userById);
router.param ('commentId', commentById);

module.exports = router;
