const mongoose = require('mongoose');
const { objectId } = mongoose.Schema;

const replySchema = new mongoose.Schema({
    _comment: {
        type: objectId,
        ref: "Comment",
        required: true
    },
    _userId: {
        type: String,
        ref: "User",
        required: true
    },
    upvotes: { type: Number },
    downvotes: { type: Number }
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model("Reply", replySchema);