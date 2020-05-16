const formidable = require('formidable');
const _ = require('lodash');
const mongoose = require('mongoose');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Reply = require('../models/reply');
const { addActionToUserHistory } = require('./user');

const commentById = async (req, res, next, id) => {
    try {
        let comment = await Comment.findById(id)
            .populate('postId')
            .populate('userId');

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        req.comment = comment;

        next();
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

const create = async (req, res) => {
    try {
        let { text } = req.body;

        // check if text is empty
        if (!text || !text.trim() || text.length === 0) {
            return res.status(400).json({
                msg: 'Comment cannot be empty',
            });
        }

        let comment = new Comment({
            text,
            postId: req.post._id,
            userId: req.profile._id,
        });

        // Save comment
        await comment.save();

        // Add this comment to post it was written
        let post = await Post.findById(req.post._id);

        post.comments.unshift(comment);

        await post.save();

        addActionToUserHistory(
            req,
            res,
            comment._id,
            req.post._id,
            'comment',
            'create',
            'post',
            comment
        );

        res.json(post);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

const remove = async (req, res) => {
    try {
        const allowed = req.isAllowed;

        if (!allowed) {
            return res
                .status(403)
                .json({ msg: 'You are not allowed to perform this action' });
        }

        let comment = req.comment;

        // Remove comment from post
        let post = await Post.findById(comment.postId);

        await post.update({ $pull: { comments: String(comment._id) } });

        // Remove comment
        await comment.remove();

        addActionToUserHistory(
            req,
            res,
            null,
            null,
            'comment',
            'remove',
            null,
            'comment removed successfully'
        );
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

const update = async (req, res) => {
    try {
        let { text } = req.body;
        let comment = req.comment;

        // Check for empty comment
        if (!text || !text.trim() || text.length === 0) {
            return res.status(400).json({ msg: 'A comment cannot be empty' });
        }

        comment.text = text;

        await comment.save();

        addActionToUserHistory(
            req,
            res,
            comment._id,
            req.post._id,
            'comment',
            'update',
            'post',
            comment
        );
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

module.exports = {
    commentById,
    create,
    remove,
    update,
};
