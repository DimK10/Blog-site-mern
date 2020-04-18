const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const categorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            unique: true,
        },
        about: {
            type: String,
            required: true,
        },
        posts: {
            type: Array,
        },
        createdFrom: {
            type: ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: { createdAt: 'created_at' } }
);

module.exports = mongoose.model('Category', categorySchema);
