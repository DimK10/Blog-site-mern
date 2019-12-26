const express = require('express');
const router = express.Router();

const { requireSignin, isAuth, isAdmin, notLoggedIn } = require('../controllers/auth');
const { userById, read, update, resetUserPassword } = require('../controllers/user');

router.get("/secret/:userId", requireSignin, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    });
});

router.put("/user/reset-password", requireSignin, isAdmin, resetUserPassword);

router.get("/user/:userId", requireSignin, read);
router.put("/user/:userId", requireSignin, isAuth, update);
router.param("userId", userById);




module.exports = router;    