const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
    {
        photoId: {
            type: ObjectId,
            ref: 'Photo',
        },

        title: {
            type: String,
            required: true,
            maxlength: 64,
        },
        description: {
            type: String,
            required: true,
        },
        author: {
            type: ObjectId,
            ref: 'User',
            required: true,
        },
        comments: [
            {
                type: ObjectId,
                ref: 'Comment',
                autopopulate: true,
            },
        ],
        categories: [
            {
                type: ObjectId,
                ref: 'Category',
            },
        ],
        upvotes: { type: Number },
        downvotes: { type: Number },
        timesShared: { type: Number },
    },
    { timestamps: { createdAt: 'created_at' } }
);

// TODO - Change to like system
postSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Post', postSchema);
