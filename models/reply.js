const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const User = require('../models/user');
const Reply = require('../models/reply');

// _rootId in schema, is the comment or reply this reply is going to be written
// This is done so that there is the ability to write nested replies - replies to replies

const replySchema = new mongoose.Schema({
    _rootId: {
        type: ObjectId,
        ref: "Comment",
        required: true
    },
    _userId: {
        type: String,
        ref: "User",
        autopopulate: true,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    replies: [{
        type: ObjectId,
        ref: "Reply",
        autopopulate: true
    }],
    upvotes: { type: Number },
    downvotes: { type: Number }
}, { timestamps: { createdAt: 'created_at' } });

replySchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model("Reply", replySchema);