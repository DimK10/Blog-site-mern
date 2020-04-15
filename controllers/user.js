const User = require('../models/user');

exports.userById = async (req, res, next, id) => {
    try {
        let user = await User.findById(id);

        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }
        // TODO - Maybe repname to user?
        req.profile = user;
        next();
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .populate('interests')
            .select('-hashed_password -salt');
        return res.json(users);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

exports.update = async (req, res) => {
    try {
        let user = req.user;

        await user.update({ $set: req.body }, { new: true });

        user.salt = undefined;
        user.hashed_password = undefined;

        res.json(user);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
    // User.findOneAndUpdate(
    //     { _id: req.profile._id },
    //     { $set: req.body },
    //     { new: true },
    //     (err, user) => {
    //         if (err) {
    //             return res.status(400).json({
    //                 error: 'You are not authorized to perform this action',
    //             });
    //         }

    //         req.hashed_password = undefined;
    //         req.salt = undefined;
    //         res.json(user);
    //     }
    // );
};

// In frontend, user history will show every action of the user: new post, comment, and reply
exports.addPostToUserHistory = async (req, res, next) => {
    try {
        let user = req.user;

        user.history.unshift({
            id: req.post._id,
            parentId: null,
            type: 'post',
            parent: null,
        });

        await user.save();

        next();
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

exports.addCommentToUserHistory = async (req, res, next) => {
    try {
        let user = req.user;

        user.history.unshift({
            id: req.comment._id,
            parentId: req.post._id,
            type: 'comment',
            parent: 'post',
        });

        await user.save();

        next();
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

exports.addReplyToUserHistory = async (req, res, next) => {
    try {
        let user = req.user;

        user.history.unshift({
            id: req.reply._id,
            parentId: req.comment._id,
            type: 'reply',
            parent: 'comment',
        });

        await user.save();

        next();
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

exports.deleteActionFromUserHistory = async (req, res, action, next) => {
    try {
        let user = req.profile;
        let removeIndex;
        switch (action) {
            case 'post':
                removeIndex = user.history
                    .map((action) => action.id.toString())
                    .indexOf(req.post._id);
                user.history.splice(removeIndex, 1);
                break;
            case 'comment':
                removeIndex = user.history
                    .map((action) => action.id.toString())
                    .indexOf(req.comment._id);
                user.history.splice(removeIndex, 1);
                break;
            case 'reply':
                removeIndex = user.history
                    .map((action) => action.id.toString())
                    .indexOf(req.reply._id);
                user.history.splice(removeIndex, 1);
                break;
            default:
                break;
        }

        await user.save();
        next();
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

exports.resetUserPassword = async (req, res, next) => {
    try {
        const { _id } = req.body;
        let user = await User.findById(_id);

        user.password = '123456';
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};
