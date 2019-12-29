const express = require('express');
const router = express.Router();

const { create, categoryById, read, update, remove, list } = require('../controllers/category');
const { requireSignin, isAuth, isAdmin, isAllowedToDeleteCategory } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get("/category/:categoryId", read);

router.post("/category/create/:userId", requireSignin, isAuth, create);

router.put("/category/:categoryId/:userId", requireSignin, isAuth, update);

router.delete("/category/:categoryId/:userId", requireSignin, isAuth, isAllowedToDeleteCategory, remove);

router.get("/categories", list);

router.param("categoryId", categoryById);
router.param("userId", userById);

module.exports = router;