const mongoose = require ('mongoose');
const {ObjectId} = mongoose.Schema;
const User = require('../models/user');
const Reply = require('../models/reply');

const CommentSchema = new mongoose.Schema ({
  text: {
      type: String,
      required: true
    },
    _postId: {
        type: ObjectId,
        ref: "Post",
        required: true
    },
    _userId: {
        type: ObjectId,
        ref: "User",
        autopopulate: true,
        required: true
    },
    replies: [{
        type: ObjectId,
        ref: "Reply",
        autopopulate: true
    }]
}, { timestamps: { createdAt: 'created_at' } });

CommentSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model("Comment", CommentSchema);
