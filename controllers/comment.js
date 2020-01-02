const formidable = require('formidable');
const _ = require('lodash');
const mongoose = require('mongoose');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Reply = require('../models/reply');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.commentById = (req, res, next, id) => {
    Comment.findById(id)
    .populate("_postId")
    .populate("_userId")
    .exec((err, comment) => {
        if(err || !comment) {
            return res.status(400).json({
                err: 'Comment not found. Error ' + err
            });
        };
        req.comment = comment;
        next();
    });
};

exports.create = (req, res) => {
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
                err: 'Comment cannot be empty'
            });
        };
    
        let comment = new Comment({ text });
        comment._postId = req.post._id;
        comment._userId = req.profile._id;
    
        console.log('comment new', comment);
    
        // Add this comment to post it was written
        Post.update({ _id: req.post._id }, { $push: { comments: comment._id } }, (err, result) => {
            if(err){
                return res.status(500).json({
                    err
                });
            };

            console.log('Result of adding comment to post comments: ', result);
        });
    
        comment.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    err
                });
            };
    
            res.json(result);
        });
    });
    
   
};

exports.remove = (req, res) => {

    const isAllowed = req.isAllowed;
    
    if(isAllowed) {
        const comment = req.comment;
        
        // Delete comment in comments filed in the post that this cmment is written 
        Post.update({ _id: req.comment._postId }, { $pull: { comments:  String(comment._id)  } }, (err, result) => {
            if(err) {
                return res.status(500).json({
                    err
                });
            };
            console.log('Result in updating post: ',result);
        });

        // Remove all the replies too
        Reply.find().exec((err, replies) => {
            if(err) {
                res.status(500).json({
                    err
                });
            };
            // console.log('replies ', replies);

            if(replies) {
                replies.forEach(doc => {
                    // console.log('doc ', doc);
                    // console.log('doc.parents[0] ', doc.parents[0]);
                    // console.log('reply.parents[0] ', reply.parents[0]);
    
                    if(String(doc.parents[0]) === String(comment._id)){
                        // Remove
                        doc.remove();
                    };
                });
            };

            
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
        })
    };
};

exports.update = (req, res) => {
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
                err: 'Comment cannot be empty'
            });
        };
    
        let comment = req.comment;
        comment = _.extend(comment, fields);

        comment.save((err, result) => {
            if(err) {
                return res.status(500).json({
                    err
                });
            };
            res.json(result);
        });
    });
};