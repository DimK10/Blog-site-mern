const User = require("../models/user");

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found",
            });
        }

        req.profile = user;
        next();
    });
};

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .populate("categories_used")
            .select("-hashed_password -salt");
        return res.json(users);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: err.message });
    }
};

exports.update = (req, res) => {
    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        { new: true },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "You are not authorized to perform this action",
                });
            }

            req.hashed_password = undefined;
            req.salt = undefined;
            res.json(user);
        }
    );
};

exports.addCommentToUserHistory = (req, res, next) => {
    let history = [];

    req.body.comments.forEach(({ _id, _postId, commentText, category }) => {
        history.push({
            _id,
            _postId,
            commentText,
            category,
        });
    });
};

exports.resetUserPassword = (req, res, next) => {
    const { _id } = req.body;
    console.log("_id ", _id);
    User.findById(_id, (err, user) => {
        if (err) {
            return res.status(400).json({
                error: "You are not authorized to perform this action",
            });
        }

        console.log("user ", user);
        user.password = "123456";
        user.save();

        return res.json({
            message: `Password of user with name ${user.name} has been reset!`,
        });
    });
};
