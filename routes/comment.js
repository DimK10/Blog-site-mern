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
  isAuth
} = require ('../controllers/auth');

const {userById} = require ('../controllers/user');

router.post ('/comment/create/:postId/:userId', requireSignin, isAuth, create);

router.put ('/comment/update/:commentId', requireSignin, isAuth, update);
router.delete (
  '/comment/delete/:commentId/:userId',
  requireSignin,
  isAuth,
  isAllowedToDeleteComment,
  remove
);

router.param ('postId', postById);
router.param ('userId', userById);
router.param ('commentId', commentById);

module.exports = router;
