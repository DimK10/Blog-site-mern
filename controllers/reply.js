const formidable = require('formidable');
const _ = require('lodash');
const mongoose = require('mongoose');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Reply = require('../models/reply');

const replyById = async (req, res, next, id) => {
    try {
        const reply = await Reply.findById(id);
        if (!reply) {
            return res.status(404).json({ msg: 'Reply not found' });
        }

        req.reply = reply;
        next();
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

const createReply = async (req, res) => {
    try {
        const { text } = req.body;

        const commentId = req.comment._id;

        if (!text || !text.trim() || text.length === 0) {
            return res.status(400).json({ msg: 'A reply cannot be empty' });
        }

        let reply = await new Reply({
            text,
            userId: req.profile._id,
            commentId,
        });

        await reply.save();

        // Add to replies array in comment
        let comment = await Comment.findById(req.comment._id);
        comment.replies.unshift(reply.id);
        await comment.save();

        res.json(comment);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

const update = async (req, res) => {
    try {
        let { text } = req.body;

        if (!text || !text.trim() || text.length === 0) {
            return res.status(400).json({ msg: 'A reply cannot be empty' });
        }

        let reply = await Reply.findById(req.reply._id);

        reply.text = text;

        await reply.save();

        res.json(reply);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

const remove = async (req, res) => {
    try {
        const isAllowed = req.isAllowed;

        if (!isAllowed) {
            return res
                .status(403)
                .json({ msg: 'You are not allowed to perform this action' });
        }

        let reply = await Reply.findById(req.reply._id);

        // Remove from comment's replies array
        let comment = await Comment.findById(reply.commentId);
        comment.replies.splice(comment.replies.indexOf(reply.id), 1);
        comment.save();

        // Remove reply
        reply.remove();

        res.json(comment);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

module.exports = {
    replyById,
    createReply,
    update,
    remove,
};
