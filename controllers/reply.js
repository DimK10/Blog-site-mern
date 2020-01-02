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
        if(err || !reply) {
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
        let parentsArr = [];
        parentsArr.push(req.comment._id);
        reply.parents = parentsArr;
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
        reply.parents = [...req.reply.parents, req.reply._id];
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


        // Check if parents array in reply, is one element, and so is a reply to comment. If not, it is a reply on a reply 
        if(reply.parents.length === 1) {
            // reply on a comment

            // Delete all replies saring that one element
            Reply.find().exec((err, replies) => {
                if(err || !replies) {
                    res.status(400).json({
                        err: 'No replies found to delete'
                    });
                };
                console.log('replies ', replies);
                
                replies.forEach(doc => {
                    console.log('doc ', doc);
                    console.log('doc.parents[0] ', doc.parents[0]);
                    console.log('reply.parents[0] ', reply.parents[0]);

                    if(String(doc.parents[0]) === String(reply.parents[0])){
                        // Remove
                        doc.remove();
                    };
                });

                return res.status(200).json({
                    message: 'Reaplies have been deleted successfully!'
                })
            });
        } else {
            // Reply is inside a reply 

            // Delete all replies that the reply.parents array as subset

            Reply.find().exec((err, replies) => {
                if(err || !replies) {
                    res.status(400).json({
                        err: 'No replies found to delete'
                    });
                };
                console.log('replies ', replies);

                replies.forEach(doc => {
                    console.log('doc ', doc);
                    // console.log('doc.parents[0] ', doc.parents[0]);
                    // console.log('reply.parents[0] ', reply.parents[0]);
                    
                    // add _id of curent reply to parent, to avoid deleting a reply that is not a reply to this reply
                    reply.parents.push(reply._id);

                    if(doc.parents.length >= reply.parents.length) {
                        // doc might be child
                        // Check
                        if(reply.parents.every(element => doc.parents.includes(element))) {
                            // remove
                            doc.remove();
                        };
                    };
                });

                return res.status(200).json({
                    message: 'Replies have been deleted successfully!'
                });
            });
        };
        req.isAllowed = false;
    };
};