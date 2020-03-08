const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const { createReadStream } = require('fs');
const mongoose = require('mongoose');
const Post = require('../models/post');
const Category = require('../models/category');
const Comment = require('../models/comment');
const  Reply = require('../models/reply');
// const Photo = require('../models/photo');
const { createModel, createBucket } = require('mongoose-gridfs');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.postById = (req, res, next, id) => {
    Post.findById(id)
    .populate('author')
    .populate('comments')
    .populate('categories')
    .exec((err, post) => {
        if(err || !post) {
            return res.status(400).json({
                err: 'Post not found. Error ' + err
            });
        };
        // Comment.populate(post.comments, { path: '_userId' }, (err, doc) => {
        //     if(err) {
        //         return res.status(500).json({
        //             err
        //         });
        //     };

        //     Reply.populate(comment.replies, { path:'_userId' }, (err, doc) => {
        //         return res.status(500).json({
        //             err
        //         });
        //     });
        // })
        req.post = post;
        next();
    });
};

exports.createAttachment = (req, res, next) => {
    const Attachment = createModel({
        modelName: 'Photo',
        connection: mongoose.connection
    });
    req.Attachment = Attachment;
    next();
};

exports.read = (req, res) => {
    return res.json(req.post);
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.hash = 'md5';


    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                err: 'Image could not be uploaded. Err: ' + err
            });
        };

        // Check for all fields
        let { title, description, categories } = fields;

        //

        // console.log('form fields: ', fields);
        // TODO - add !categories
        if(!title || !description) {
            return res.status(400).json({
                err: 'All fields are required'
            });
        };

        // Change description to json data cause it will be rich text with/or videos and/or images
        fields.description = JSON.stringify(description);

        // Modify categories, because it will be sent as an array
        fields.categories = JSON.parse(fields.categories);

        let post = new Post(fields);
        // console.log('post ', post);
        post.author = req.params.userId;

        // Photo
        if(files.photo) {
            // console.log('files photo: ', files.photo);
            // console.log('mongoose connection: ', mongoose.connection);

            const Attachment = req.Attachment;

            // console.log('Attachment: ', Attachment);

            // Write file to gridfs
            const readStream = createReadStream(files.photo.path);
            const options = ({ filename: files.photo.name, contentType: files.photo.type });
            Attachment.write(options, readStream, (err, file) => {
                if(err) {
                    return res.status(500).json({
                        err: 'Could not write to gridfs model. Reason: ' + err
                    });
                };

                console.log('file._id ', file._id);

                // Save id to post document
                post.photoId = file._id;

                post.save((err, result) => {
                    if(err) {
                        return res.status(400).json({
                            err: err
                        });
                    };


                   // Populate necessary data
                   Post.findById(result._id)
                   .populate('comments')
                   .populate('categories')
                   .populate('author')
                   .populate('photoId')
                   .exec((err, newResult) => {
                       if(err) {
                           return res.status(400).json({
                               err: err
                           });
                       };

                       console.log(newResult)
                       
                       res.json(newResult);
                   });
                });
            });
        } else {
            post.save((err, result) => {
                if(err) {
                    return res.status(400).json({
                        err: err
                    });
                };

                // console.log(result);

                 // Populate necessary data
                    Post.findById(result._id)
                    .populate('comments')
                    .populate('categories')
                    .populate('author')
                    .exec((err, newResult) => {
                        if(err) {
                            return res.status(400).json({
                                err: err
                            });
                        };

                        // console.log(newResult)
                        
                        res.json(newResult);
                    })


                // res.json(result);
            });
        };        
    });
};

exports.remove = (req, res) => {
    const isAllowed = req.isAllowed;

    if(isAllowed) {
        const post = req.post;
        Post.findById(post._id, (err, doc) => {
            if(err) {
                return res.status(500).json({
                    err: 'Post not found. This shouldnt happen. Error ' + err
                });
            };

            // Remove photo linked to post in gridfs
            // Check if thre is a photo linked with this post
            if(post.photoId) {

                // Remove chunks of photo
                const bucket = createBucket();
                bucket.deleteFile(doc.photoId, (error, results) => { 
                    if(err) {
                        return res.status(500).json({ 
                            err: 'Photo could not be deleted. Reason: ' + err
                        });
                    };

                    // console.log('Chunks of photo should now be successfully deleted');
                 });

                const Attachment = req.Attachment;
                Attachment.unlink(doc.photoId, (err) => {
                    if(err) {
                        return res.status(500).json({ 
                            err: 'Photo could not be deleted. Reason: ' + err
                        });
                    };
                });
            };
            
    
            // Remove all associated comments and replies with this post
            Comment.find({ _id: { $in: doc.comments } }, (err, doc) => {
                if(err) {
                    return res.status(500).json({ 
                        err: 'Comment could not be found. This shouldnt happen. Reason: ' + err
                    });
                };
                Reply.remove({ _id: { $in:  doc.replies } });
            });

            Comment.remove({ _id: { $in: doc.comments } });
        });

        post.remove((err, removedPost) => {
            if(err) {
                return res.status(400).json({
                    err
                });
            };
            
            // Default isAllowed to false
            req.listAllowed = false;
            res.json({
                'message': 'Post deleted successfully'
            });
        });
    };
};

exports.update = (req, res) => {

    if(req.isAllowed) {
        let form = formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
            if(err) {
                return res.status(400).json({
                    error: 'Image could not be uploaded'
                });
            };
            const { title, description, categories } = fields;

            if(!title || !description || !categories) {
                return res.status(400).json({
                    err: 'All fileds are required'
                });
            };

            let post = req.post;
            post = _.extend(post, fields);
        
            // Photo 
            if(files.photo) {
                // Check if files.photo.hash (md5) is the same as the md5 hash of new photo submitted
                // Read file from gridfs
                const Attachment = req.Attachment;
                const { photoId } = post;
                // console.log('photoId of post: ', photoId);
                const fileFromDb = Attachment.read({ _id: photoId });
                // console.log('filefromDb: ', fileFromDb);

                if(files.photo.hash !== fileFromDb.md5) {
                    console.log('Photo is not the same -- save new photo');
                    
                    // New photo is different that the one stored, delete old and add new
                    // Remove file and its content 
                    Attachment.unlink(photoId, (err) => {
                        if(err) {
                            return res.status(500).json({ 
                                err: 'File could not be deleted. Reason: ' + err
                            });
                        };
                    });

                    // Save new photo to gridfs
                    const readStream = createReadStream(files.photo.path);
                    const options = ({ filename: files.photo.name, contentType: files.photo.type });
                    Attachment.write(options, readStream, (err, file) => {
                        if(err) {
                            return res.status(500).json({
                                err: 'Could not write to gridfs model. Reason: ' + err
                            });
                        };

                        // console.log('file._id ', file._id);

                        // Save id to post document
                        post.photoId = file._id;

                        post.save((err, result) => {
                            if(err) {
                                return res.status(400).json({
                                    err
                                });
                            };

                            // Populate necessary data
                            Post.findById(result._id)
                            .populate('comments')
                            .populate('categories')
                            .populate('author')
                            .exec((err, newResult) => {
                                if(err) {
                                    return res.status(400).json({
                                        err: err
                                    });
                                };

                                // console.log(newResult)
                                
                                res.json(newResult);
                            });
                            // res.json(result);
                        });
                    });
                } else {
                    console.log('Photo was the same -- not saved');

                    post.save((err, result) => {
                        if(err) {
                            return res.status(500).json({
                                err
                            });
                        };

                        // Populate necessary data
                        Post.findById(result._id)
                        .populate('comments')
                        .populate('categories')
                        .populate('author')
                        .exec((err, newResult) => {
                            if(err) {
                                return res.status(400).json({
                                    err: err
                                });
                            };

                            // console.log(newResult)
                            
                            res.json(newResult);
                        });
                        // res.json(result);
                    });
                };
            };
        });
    }; 
};

exports.photo = (req, res, next) => {
    if(req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    };

    next();
};

exports.listByInterests= (req, res) => {
    let order = req.body.order ? req.body.order : 'asc';
    // let sortBy = req.body.sortBy ? req.body.sortBy : 'createdAt'
    let limit = req.body.limit ? req.body.limit : 6;

    let interests = req.profile.interests;

    Post.find({ "categories": { "$in": interests } })
    .populate('author')
    .populate({ 
        path: 'comments',
        populate: {
            path: '_userId',
            select: '_id name',
            model: 'User'
        }
    })
    .populate({
        path: 'categories',
        populate: {
            path: '_createdFrom',
            select: '_id name',
            model: 'User'
        }
    })
    .exec((err, posts) => {
        if(err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        };

        res.json(posts);
    });
};

exports.listAll = (req, res, next) => {
    let order = req.body.order ? req.body.order : 'asc';
    let limit = req.body.limit ? req.body.limit : 6;

    Post.find()
    .populate('author')
    .populate({ 
        path: 'comments',
        model: 'Comment'
        /* populate: [
            {
                path: '_userId',
                select: '_id name',
                model: 'User'
            },
            {
                path: 'replies',
                select: 'text',
                model: 'Reply',
                populate: [
                    {
                        path: '_userId',
                        select: '_id name',
                        model: 'User',
                    },
                    {
                        
                        path: 'replies',
                        select: 'text',
                        model: 'Reply',
                    
                    }
                ]
            }
        ] */
    })
    .populate({
        path: 'categories',
        populate: {
            path: '_createdFrom',
            select: '_id name',
            model: 'User'
        }
    })
    .exec((err, posts) => {
        if(err) {
            return res.status(400).json({
                err
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
        // console.log('category _id: ', _id);

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
};

exports.readImg = (req, res) => {
    const post = req.post;
    const Attachment = req.Attachment;
    let photo = [];

    const readStream = Attachment.read({ _id: post.photoId });

    readStream.pipe(res);

    // console.log('readStream: ', readStream);

    // photo = [...readStream];
    // res.send(photo);
};
