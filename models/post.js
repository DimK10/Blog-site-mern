const mongoose = require('mongoose');
const { objectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        maxlength: 64
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: objectId,
        ref: "User",
         required: true
    },
    comments: [{
        type: objectId,
        ref: "Comment"
    }],
    categories: [{
        type: objectId,
        ref: "Category"
    }],
    upvotes: { type: Number },
    downvotes: { type: Number },
    timesShared: { type: Number },

}, { timestamps: { createdAt: 'created_at' } });


module.exports = mongoose.model("Post", postSchema);