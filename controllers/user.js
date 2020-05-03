const User = require('../models/user');
const Post = require('../models/post');
const { createBucket } = require('mongoose-gridfs');

const userById = async (req, res, next, id) => {
    try {
        let user = await User.findById(id).select('+salt +hashed_password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        // TODO - Maybe repname to user?
        req.profile = user;
        next();
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

const read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

const getAllUsers = async (req, res) => {
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

const update = async (req, res) => {
    try {
        let user = req.profile;

        let {
            name,
            email,
            password,
            newPassword,
            about = '',
            interests,
        } = req.body;

        //TODO - Postman test - delete
        interests = JSON.parse(interests);

        let avatar = req.file;

        if (!user.authenticate(password.toString())) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check if there is a photo
        if (avatar) {
            const Attachment = req.Attachment;

            // Write image to gridFS
            // for photo i need path
            // const readStream = createReadStream(photo.orinalname);
            const readStream = new stream.PassThrough();
            readStream.end(avatar.buffer);

            const options = {
                filename: user.name,
                contentType: avatar.type,
            };

            await Attachment.write(options, readStream, async (err, file) => {
                // Either Attacchment.write is buggy, or im cant code
                // Cant get any value using await like
                // const result = await Attachment.write(...)
                // so i ll stick with this code block, so that i can save avatarId
                if (err) {
                    console.error(err.message);
                    res.status(500).json({
                        msg: "Can't upload profile image",
                    });
                    return;
                }

                // Save photo id to user
                avatarId = file._id.toString();
                // TODO - Add promote user to admin
                user.avatarId = avatarId;
                user.name = name;
                user.email = email;
                user.password = newPassword;
                user.about = about;
                user.interests = interests;

                await user.save();

                user.salt = undefined;
                user.hashed_password = undefined;

                return res.send(user);
            });
            return;
        }

        user.avatarId = null;
        user.name = name;
        user.email = email;
        user.password = newPassword;
        user.about = about;
        user.interests = interests;

        await user.save();

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
const addPostToUserHistory = async (req, res, next) => {
    try {
        let user = req.user;

        user.history.unshift({
            id: req.post._id,
            parentId: null,
            type: 'post',
            action: 'create',
            parent: null,
        });

        await user.save();

        next();
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

const addCommentToUserHistory = async (req, res, next) => {
    try {
        let user = req.user;

        user.history.unshift({
            id: req.comment._id,
            parentId: req.post._id,
            type: 'comment',
            action: 'create',
            parent: 'post',
        });

        await user.save();

        next();
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

const addReplyToUserHistory = async (req, res, next) => {
    try {
        let user = req.user;

        user.history.unshift({
            id: req.reply._id,
            parentId: req.comment._id,
            type: 'reply',
            action: 'create',
            parent: 'comment',
        });

        await user.save();

        next();
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

const addActionToUserHistory = async (
    req,
    res,
    id,
    parentId,
    type,
    action,
    parent,
    data
) => {
    try {
        let user = req.profile;

        user.history.unshift({
            id,
            parentId,
            type,
            action,
            parent,
        });

        await user.save();
        return res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// TODO - I should remove
const deleteActionFromUserHistory = async (req, res, action, next) => {
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

const resetUserPassword = async (req, res, next) => {
    try {
        let user = req.profile;

        user.password = '123456';
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

const readUserImg = async (req, res) => {
    try {
        const user = req.profile;
        const Attachment = req.Attachment;

        if (!user.avatarId) {
            return res
                .status(404)
                .json({ msg: 'User does not have an image ' });
        }
        const readStream = await Attachment.read({ _id: user.avatarId });

        readStream.pipe(res);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
};

const getPostsWrittenByUser = async (req, res) => {
    try {
        let user = req.profile;

        let posts = await Post.find({ author: user._id }).populate(
            'categories'
        );

        res.send(posts);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

module.exports = {
    userById,
    read,
    getAllUsers,
    update,
    addPostToUserHistory,
    addCommentToUserHistory,
    addReplyToUserHistory,
    deleteActionFromUserHistory,
    resetUserPassword,
    addActionToUserHistory,
    readUserImg,
    getPostsWrittenByUser,
};
