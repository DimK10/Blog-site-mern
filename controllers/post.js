const Post = require('../models/post');
const Category = require('../models/category');
const Comment = require('../models/comment');
const Reply = require('../models/reply');
const { createBucket } = require('mongoose-gridfs');

const postById = async (req, res, next, id) => {
    try {
        let post = await Post.findById(id)
            .populate('author')
            .populate('comments')
            .populate('categories');

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        req.post = post;
        next();
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

const read = (req, res) => {
    return res.json(req.post);
};

const create = async (req, res) => {
    try {
        let { title, description, categories } = req.body;
        let imageId = null;
        let image = req.file;

        if (image) {
            const Attachment = req.Attachment;

            const readStream = new readStream.PassThrough();
            readStream.end(image.buffer);

            console.log(image);

            const options = {
                filename: image.name,
                contentType: image.type,
            };

            await Attachment.write(options, readStream, async (err, file) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({
                        msg: "Can't upload post image",
                    });
                    return;
                }

                // Save
                imageId = file._id.toString();

                let post = new Post({
                    imageId,
                    title,
                    description,
                    categories,
                });

                // add post._id to each category, so that when category is deleted, it wont show to post
                categories.foreach(async (categoryId) => {
                    let category = await Category.findById(categoryId);
                    category.posts.push(post._id);
                    await category.save();
                });

                await post.save();
                return res.json(post);
            });
            return;
        }

        let post = new Post({
            imageId,
            title,
            description,
            categories,
        });

        await post.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

const remove = (req, res) => {
    const isAllowed = req.isAllowed;

    if (isAllowed) {
        const post = req.post;
        Post.findById(post._id, (err, doc) => {
            if (err) {
                return res.status(500).json({
                    err: 'Post not found. This shouldnt happen. Error ' + err,
                });
            }

            // Remove photo linked to post in gridfs
            // Check if thre is a photo linked with this post
            if (post.photoId) {
                // Remove chunks of photo
                const bucket = createBucket();
                bucket.deleteFile(doc.photoId, (error, results) => {
                    if (err) {
                        return res.status(500).json({
                            err: 'Photo could not be deleted. Reason: ' + err,
                        });
                    }

                    // console.log('Chunks of photo should now be successfully deleted');
                });

                const Attachment = req.Attachment;
                Attachment.unlink(doc.photoId, (err) => {
                    if (err) {
                        return res.status(500).json({
                            err: 'Photo could not be deleted. Reason: ' + err,
                        });
                    }
                });
            }

            // Remove all associated comments and replies with this post
            Comment.find({ _id: { $in: doc.comments } }, (err, doc) => {
                if (err) {
                    return res.status(500).json({
                        err:
                            'Comment could not be found. This shouldnt happen. Reason: ' +
                            err,
                    });
                }
                Reply.remove({ _id: { $in: doc.replies } });
            });

            Comment.remove({ _id: { $in: doc.comments } });
        });

        post.remove((err, removedPost) => {
            if (err) {
                return res.status(400).json({
                    err,
                });
            }

            // Default isAllowed to false
            req.listAllowed = false;
            res.json({
                message: 'Post deleted successfully',
            });
        });
    }
};

const update = async (req, res) => {
    try {
        const allowed = req.isAllowed;
        if (!allowed) {
            return res
                .status(403)
                .json({ msg: 'You are not allowed to perform this action' });
        }

        let { title, description, categories } = req.body;
        let imageId = null;
        let image = req.file;

        let post = Post.findById(req.post._id);

        // There are 3 cases
        // user adds image on a post that didn't have an image
        // user does not add an image to update the post
        // user updates image

        // 1st case
        if (image && !post.imageId) {
            const Attachment = req.Attachment;

            const readStream = new readStream.PassThrough();
            readStream.end(image.buffer);

            console.log('image obj on 1st case', image);

            const options = {
                filename: image.name,
                contentType: image.type,
            };

            await Attachment.write(options, readStream, async (err, file) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({
                        msg: "Can't upload post image",
                    });
                    return;
                }

                // Save
                imageId = file._id.toString();

                post.imageId = imageId;
                post.title = title;
                post.description = description;
                post.categories = categories;

                await post.save();

                return res.json(post);
            });
        }

        // 2nd case
        if (!image) {
            post.title = title;
            post.description = description;
            post.categories = categories;

            await post.save();

            return res.json(post);
        }

        // 3rd case
        // TODO - Maybe check user image with post image, if they are the same
        // if it is sub-optimal
        // Delete previous image
        Attachment.unlink(post.imageId, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    msg: 'Image could not be deleted ',
                });
            }
        });

        // Add new image to post
        const Attachment = req.Attachment;

        const readStream = new readStream.PassThrough();
        readStream.end(image.buffer);

        console.log('image in 3rd case ', image);

        const options = {
            filename: image.name,
            contentType: image.type,
        };

        await Attachment.write(options, readStream, async (err, file) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({
                    msg: "Can't upload post image",
                });
                return;
            }

            // Save
            imageId = file._id.toString();

            post.imageId = imageId;
            post.title = title;
            post.description = description;
            post.categories = categories;

            await post.save();
            return res.json(post);
        });
        return;
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

// TODO- Is this needed? DELETE probably
const photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }

    next();
};

// TODO - THIS NEEDS TESTING
const listByInterests = async (req, res) => {
    try {
        let interests = req.profile.interests;
        let posts = await Post.find({ categories: { $in: interests } })
            .sort({ updatedAt: 'desc' })
            .populate('author')
            .populate({
                path: 'comments',
                model: 'Comment',
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
                        populate: [
                            {
                                path: '_userId',
                                select: '_id name',
                                model: 'User',
                            },
                        ],
                    },
                ],
            })
            .populate({
                path: 'categories',
                populate: {
                    path: '_createdFrom',
                    select: '_id name',
                    model: 'User',
                },
            });

        if (!posts) {
            return res.status(400).json({ msg: 'No posts found' });
        }

        res.json(posts);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
    // let order = req.body.order ? req.body.order : 'asc';
    // // let sortBy = req.body.sortBy ? req.body.sortBy : 'createdAt'
    // let limit = req.body.limit ? req.body.limit : 6;

    // let interests = req.profile.interests;

    // Post.find({ categories: { $in: interests } })
    //     .populate('author')
    //     .populate({
    //         path: 'comments',
    //         populate: {
    //             path: '_userId',
    //             select: '_id name',
    //             model: 'User',
    //         },
    //     })
    //     .populate({
    //         path: 'categories',
    //         populate: {
    //             path: '_createdFrom',
    //             select: '_id name',
    //             model: 'User',
    //         },
    //     })
    //     .exec((err, posts) => {
    //         if (err) {
    //             return res.status(400).json({
    //                 err: errorHandler(err),
    //             });
    //         }

    //         res.json(posts);
    //     });
};

const listAll = async (req, res, next) => {
    let order = req.body.order ? req.body.order : 'asc';
    let limit = req.body.limit ? req.body.limit : 6;

    try {
        let posts = await Post.find()
            .sort({ updatedAt: 'desc' })
            .populate('author')
            .populate({
                path: 'comments',
                model: 'Comment',
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
                        populate: [
                            {
                                path: '_userId',
                                select: '_id name',
                                model: 'User',
                            },
                        ],
                    },
                ],
            })
            .populate({
                path: 'categories',
                populate: {
                    path: '_createdFrom',
                    select: '_id name',
                    model: 'User',
                },
            });

        if (!posts) {
            return res.status(400).json({ msg: 'No posts found' });
        }

        res.send(posts);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

const listByCategory = async (req, res) => {
    let category = req.category;

    let posts = await Post.find({ categories: { $in: category } })
        .sort({ updatedAt: 'desc' })
        .populate('author')
        .populate({
            path: 'comments',
            model: 'Comment',
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
                    populate: [
                        {
                            path: '_userId',
                            select: '_id name',
                            model: 'User',
                        },
                    ],
                },
            ],
        })
        .populate({
            path: 'categories',
            populate: {
                path: '_createdFrom',
                select: '_id name',
                model: 'User',
            },
        });

    if (!posts) {
        return res.status(400).json({ msg: 'No posts found' });
    }

    res.json(post);
    try {
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

const readImg = (req, res) => {
    try {
        const post = req.post;
        const Attachment = req.Attachment;
        let photo = [];

        const readStream = Attachment.read({ _id: post.photoId });

        readStream.pipe(res);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
    postById,
    read,
    create,
    update,
    remove,
    photo,
    listByInterests,
    listAll,
    listByCategory,
    readImg,
};
