const mongoose = require ('mongoose');
const {ObjectId} = mongoose.Schema;

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
        required: true
    },
    replies: [{
        type: ObjectId,
        ref: "Reply"
    }]
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model("Comment", CommentSchema);
