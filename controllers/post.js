const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Post = require('../models/post');
const Category = require('../models/category');
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

        // Change description to json data cause it will be rich text with/or videos and/or images
        fields.description = JSON.stringify(description);

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
    });
};

exports.listByInterests= (req, res) => {
    let order = req.body.order ? req.body.order : 'asc';
    // let sortBy = req.body.sortBy ? req.body.sortBy : 'createdAt'
    let limit = req.body.limit ? req.body.limit : 6;

    let interests = req.profile.interests;

    Post.find({ "categories": { "$in": interests } })
    .populate('author')
    .populate('comments')
    .populate('categories')
    .exec((err, posts) => {
        if(err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        };

        res.json(posts);
    });
};

exports.listAll = (req, res) => {
    let order = req.body.order ? req.body.order : 'asc';
    let limit = req.body.limit ? req.body.limit : 6;

    Post.find()
    .populate('author')
    .populate('comments')
    .populate('categories')
    .exec((err, posts) => {
        if(err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        };

        res.json(posts);
    });
};

exports.listExploreNew = (req, res) => {
    let order = req.body.order ? req.body.order : 'asc';
    let limit = req.body.limit ? req.body.limit : 6;

    if(!req.sortBy || typeof sortBy !== string) {
        // User haven't clicked a category to show(?) send err
        return res.status(400).json({ 
            err: 'You haven\'t specified a category to show posts from!'
        });
    };

    let sortBy = req.sortBy; // This is a category 
    
    Category.find({ 'title': sortBy }).exec((err, category) => {
        if(err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        };

        const { _id } = category;
        console.log('category _id: ', _id);

        // Show posts based on category chosen to explore
        // Find post or posts that have a category that is the same with the chosen one
        Post.find({ 'categories': { '$in': [ _id ] } }).exec((err, posts) => {
            if(err) {
                return res.status(400).json({
                    err: 'No posts found for the category chosen'
                });
            };

            res.json(posts);
        });
    });
   
}
