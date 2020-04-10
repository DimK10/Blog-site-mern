const mongoose = require('mongoose');
const { createModel } = require('mongoose-gridfs');

// This middleware allows to use Attachent for storing and reading images from gridfs gloabally via request
exports.createAttachment = (req, res, next) => {
    const Attachment = createModel({
        modelName: 'Photo',
        connection: mongoose.connection,
    });
    req.Attachment = Attachment;
    next();
};
