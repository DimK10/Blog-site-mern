const express = require('express');
const router = express.Router();
const multer = require('multer');
let storage = multer.memoryStorage();
let upload = multer({ storage: storage });

const {
    create,
    postById,
    read,
    readImg,
    remove,
    update,
    listByInterests,
    listAll,
    listByCategory,
} = require('../controllers/post');

const { postValidator } = require('../validator/postValidator');

const { createAttachment } = require('../middlewares');

const { requireSignin, isAuth, isAllowed } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { categoryById } = require('../controllers/category');

router.get('/post/:postId', read);

router.get('/post/image/:postId', createAttachment, readImg);

router.post(
    '/post/create/:userId',
    requireSignin,
    upload.single('image'),
    postValidator,
    createAttachment,
    create
);

router.delete(
    '/delete-post/:postId/:userId',
    requireSignin,
    isAuth,
    isAllowed({ type: 'post' }),
    createAttachment,
    remove
);

router.put(
    '/update-post/:postId/:userId',
    requireSignin,
    isAuth,
    isAllowed({ type: 'post' }),
    upload.single('image'),
    postValidator,
    createAttachment,
    update
);

router.get('/posts/by-interest', listByInterests);
router.get('/posts/all', listAll);
router.get('/posts/by-category/:categoryId', listByCategory);

router.param('userId', userById);
router.param('postId', postById);
router.param('categoryId', categoryById);

module.exports = router;
