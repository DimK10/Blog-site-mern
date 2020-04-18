const express = require('express');
const router = express.Router();

const {
    create,
    categoryById,
    read,
    update,
    remove,
    list,
} = require('../controllers/category');
const {
    requireSignin,
    isAuth,
    isAdmin,
    isAllowed,
} = require('../controllers/auth');
const { categoryValidator } = require('../validator/categoryValidator');
const { userById } = require('../controllers/user');

router.get('/category/:categoryId', read);

router.post(
    '/category/create/:userId',
    requireSignin,
    isAuth,
    categoryValidator,
    create
);

router.put(
    '/category/:categoryId/:userId',
    requireSignin,
    isAuth,
    categoryValidator,
    update
);

router.delete(
    '/category/:categoryId/:userId',
    requireSignin,
    isAuth,
    isAllowed({ type: 'category', action: 'delete' }),
    remove
);

router.get('/categories', list);

router.param('categoryId', categoryById);
router.param('userId', userById);

module.exports = router;
