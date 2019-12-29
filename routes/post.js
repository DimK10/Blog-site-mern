const express = require ('express');
const router = express.Router();

const {
  create,
  postById,
  read,
  remove,
  update,
  listByInterests,
  listAll,
  listExploreNew,
  createAttachment,
} = require ('../controllers/post');

const {
  requireSignin,
  isAuth,
  isAdmin,
  isAllowedToDeletePost,
} = require ('../controllers/auth');
const {userById} = require ('../controllers/user');

router.get ('/post/:postId', read);

router.post ('/post/create/:userId', requireSignin, createAttachment, create);

router.delete (
  '/post/:postId/:userId',
  requireSignin,
  isAuth,
  isAllowedToDeletePost,
  createAttachment,
  remove
);

router.put ('/post/:postId/:userId', requireSignin, isAuth, createAttachment, update);

router.get("/posts/by-interest", listByInterests);
router.get("/posts/all", listAll);
router.get("/posts/explore-new", listExploreNew);

router.param("userId", userById);
router.param("postId", postById);

module.exports = router;

