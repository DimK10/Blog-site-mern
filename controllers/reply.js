const formidable = require('formidable');
const _ = require('lodash');
const mongoose = require('mongoose');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Reply = require('../models/reply');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.replyById = (req, res, next, id) => {
    Reply.findById(id)
    // .populate('_rootId')
    // .populate('replies')
    .exec((err, reply) => {
        if(err) {
            return res.status(400).json({
                err: 'Reply not found. Error ' + err
            });
        };
        req.reply = reply;
        next();
    });
};

exports.createToComment = (req, res) => {
    let form = formidable.IncomingForm();

    form.parse(req, (err, fields) => {
        if(err) {
            return res.status(400).json({
                err
            });
        };

        let { text } = fields;

        if(!text || !text.trim() || text.length === 0) {
            return res.status(400).json({
                err: 'Reply cannot be empty'
            });
        };
        
        let reply = new Reply({ text });
        reply._rootId = req.comment._id;
        reply._userId = req.profile._id;

        // Add this reply to comment - reply it was written
        Comment.update({ _id: req.comment._id }, { $push: { replies: reply._id } }, (err, result) => {
            if(err){
                return res.status(500).json({
                    err
                });
            };

            console.log('Result of adding reply to comment: ', result);
        });

        reply.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    err
                });
            };
    
            res.json(result);
        });

    });
};

exports.createToReply = (req, res) => {
    let form = formidable.IncomingForm();

    form.parse(req, (err, fields) => {
        if(err) {
            return res.status(400).json({
                err
            });
        };

        let { text } = fields;

        if(!text || !text.trim() || text.length === 0) {
            return res.status(400).json({
                err: 'Reply cannot be empty'
            });
        };
        
        let reply = new Reply({ text });
        reply._rootId = req.reply._id;
        reply._userId = req.profile._id;

        // Add this reply to reply it was written
        Reply.update({ _id: req.reply._id }, { $push: { replies: reply._id } }, (err, result) => {
            if(err){
                return res.status(500).json({
                    err
                });
            };

            console.log('Result of adding reply to reply: ', result);
        });

        reply.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    err
                });
            };
    
            res.json(result);
        });

    });
};

exports.update = (req, res) => {
    let form = formidable.IncomingForm();

    form.parse = (req, res) => {
        if(err) {
            return res.status(400).json({
                err
            });
        };

        let { text } = fields;

        if(!text || !text.trim() || text.length === 0) {
            return res.status(400).json({
                err: 'Reply cannot be empty'
            });
        };
        
        let reply = req.reply;
        reply = _.extend(reply, fields);

        reply.save((err, result) => {
            if(err) {
                return res.status(500).json({
                    err
                });
            };
            res.json(result);
        });
    };
};

exports.remove = (req, res) => {
    const isAllowed = req.isAllowed;

    if(isAllowed) {
        const reply = req.reply;
        
        // Delete reply in replies filed in the post that this comment - reply is written 
        Comment.update({ _id: req.reply._rootId }, { $pull: { replies:  String(reply._id)  } }, (err, result) => {
            if(err) {
                return res.status(500).json({
                    err
                });
            };

            console.log('Result in removing reply: ', result);
            if(!result) {

                // This reply was not in a comment, so it must be a reply to a reply
                // Try to repmove from replies array in reply model, if found
                
                Reply.update({ _id: req.reply._rootId }, { $pull: { replies: String(reply._id) } }, (err, result) => {
                    if(err) {
                        return res.status(500).json({
                            err
                        });
                    };

                    console.log('Result in removing reply: ', result);
                });
            };
        });

        // Remove all the replies too
        Reply.remove({ _id: { $in: comment.replies} }, (err, result) => {
            if(err) {
                return res.status(500).json({
                    err
                });

            };
            console.log('result in replies remove:', result);
        });

        // Remove comment

        comment.remove((err) => {
            if(err) {
                return res.status(500).json({
                    err
                });
            };
            
            // Default isAllowed to false
            req.listAllowed = false;
            res.json({
                'message': 'Comment deleted successfully'
            });
        });
    };
};