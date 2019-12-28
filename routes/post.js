const express = require ('express');
const router = express.Router ();

const {
  create,
  postById,
  read,
  remove,
  update,
  listByInterests,
  listAll,
  listExploreNew,
  photo,
} = require ('../controllers/post');

const {
  requireSignin,
  isAuth,
  isAdmin,
  isAllowed,
} = require ('../controllers/auth');
const {userById} = require ('../controllers/user');

router.get ('/post/:postId', read);

router.post ('/post/create/:userId', requireSignin, create);

router.delete (
  '/post/:postId/:userId',
  requireSignin,
  isAuth,
  isAllowed,
  remove
);

router.put ('/post/:postId/:userId', requireSignin, isAuth, update);

router.get("/posts/by-interest", listByInterests);
router.get("/posts/all", listAll);
router.get("/posts/explore-new", listExploreNew);

router.param("userId", userById);
router.param("postId", postById);

module.exports = router;

