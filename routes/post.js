const express = require ('express');
const router = express.Router();

const {
  create,
  postById,
  read,
  readImg,
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
  isAllowed,
} = require ('../controllers/auth');
const {userById} = require ('../controllers/user');

router.get ('/post/:postId', read);

router.get('/post/image/:postId', createAttachment, readImg);

router.post ('/post/create/:userId', requireSignin, createAttachment, create);

router.delete (
  '/delete-post/:postId/:userId',
  requireSignin,
  isAuth,
  isAllowed({ type: 'post', action: 'delete' }),
  createAttachment,
  remove
);

router.put ('/update-post/:postId/:userId', requireSignin, isAuth, createAttachment, update);

router.get("/posts/by-interest", listByInterests);
router.get("/posts/all", listAll);
router.get("/posts/explore-new", listExploreNew);

router.param("userId", userById);
router.param("postId", postById);

module.exports = router;

