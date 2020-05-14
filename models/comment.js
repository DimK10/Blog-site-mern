const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const User = require('../models/user');
const Reply = require('../models/reply');

const CommentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        postId: {
            type: ObjectId,
            ref: 'Post',
            required: true,
        },
        userId: {
            type: ObjectId,
            ref: 'User',
            required: true,
        },
        replies: [
            {
                type: ObjectId,
                ref: 'Reply',
            },
        ],
    },
    { timestamps: { createdAt: 'created_at' } }
);

// TODO - This might be useless
// CommentSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Comment', CommentSchema);
