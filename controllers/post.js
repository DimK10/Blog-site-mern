const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Post = require('../models/post');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.postById = (req, res, next, id) => {
    Post.findById(id)
    .populate('author')
    .populate('comments')
    .populate('categories')
    .exec((err, post) => {
        if(err || !post) {
            return res.status(400).json({
                err: 'Post not found'
            });
        };
        req.post = post;
        next();
    });
};

exports.read = (req, res) => {
    return res.json(req.product);
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields) => {
        if(err) {
            return res.status(400).json({
                err: 'Unexpected error. error: ' + err
            });
        };

        // Check for all fields
        const { title, description, categories } = fields;

        if(!title || !description || !categories) {
            return res.status(400).json({
                err: 'All fileds are required'
            });
        };

        let post = new Post(fields);

        post.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    err: errorHandler(err)
                });
            };
            res.json(result);
        });
    });
};

exports.remove = (req, res) => {
    let post = req.post;
    post.remove((err, removedPost) => {
        if(err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        };

        res.json({
            'message': 'Post deleted successfully'
        });
    });
};

exports.update = (req, res) => {
    const { title, description, categories } = fields;

    if(!title || !description || !categories) {
        return res.status(400).json({
            err: 'All fileds are required'
        });
    };

    let post = req.post;
    post = _.extend(post, fields);

    post.save((err, result) => {
        if(err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        };

        res.json(result);
    })
}
