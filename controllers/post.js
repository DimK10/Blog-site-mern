const Post = require('../models/post');
const Category = require('../models/category');
const Comment = require('../models/comment');
const Reply = require('../models/reply');
const stream = require('stream');
const { createBucket } = require('mongoose-gridfs');

const { addActionToUserHistory } = require('./user');

const postById = async (req, res, next, id) => {
    try {
        let post = await Post.findById(id)
            .populate('author')
            .populate({
                path: 'comments',
                select: '_id text',
                model: 'Comment',
                populate: [
                    {
                        path: 'userId',
                        select: '_id name avatarId',
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

const readPostComments = async (req, res) => {
    try {
        let post = req.post;

        res.send(post.comments);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

const create = async (req, res) => {
    try {
        let { title, description } = req.body;
        let imageId = null;
        let image = req.file;
        let author = req.profile._id;

        //TODO - Only for testing in postman - delete
        // console.log("categories ", typeof categories);

        // console.log('image ', image);

        // TODO - might need to change the way I handle arrays
        let categories = JSON.parse(req.body.categories).map((catId) => catId);

        if (image) {
            const Attachment = req.Attachment;

            const readStream = new stream.PassThrough();
            readStream.end(image.buffer);

            // console.log(image);

            const options = {
                filename: image.originalname,
                contentType: image.mimetype,
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
                // console.log('imageId ', imageId);

                let post = new Post({
                    imageId,
                    title,
                    description,
                    categories,
                    author,
                });

                // add post._id to each category, so that when category is deleted, it wont show to post

                categories.forEach(async (categoryId) => {
                    let category = await Category.findById(categoryId);
                    category.posts.push(post._id);
                    await category.save();
                });

                await post.save();

                // Add to user history
                addActionToUserHistory(
                    req,
                    res,
                    post._id,
                    null,
                    'post',
                    'create',
                    null,
                    post
                );
            });
            return;
        }

        let post = new Post({
            imageId,
            title,
            description,
            categories,
            author,
        });

        await post.save(); // Add to user history
        addActionToUserHistory(
            req,
            res,
            post._id,
            null,
            'post',
            'create',
            null,
            post
        );
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
};

const remove = async (req, res) => {
    try {
        const allowed = req.isAllowed;

        if (!allowed) {
            return res
                .status(403)
                .json({ msg: 'You are not allowed to perform this action' });
        }

        let post = req.post;

        // Delete image if there is an image linked to the post
        if (post.imageId) {
            // Remove chunks of photo
            const bucket = createBucket();
            await bucket.deleteFile(post.imageId, () => {
                console.log('image removed');
                return;
            });

            const Attachment = req.Attachment;

            await Attachment.unlink(post.imageId);
        }

        // Delete comments and replies
        if (post.comments.length > 0) {
            post.comments.forEach(async (comment) => {
                if (comment.replies.length > 0) {
                    // Delete the replies
                    comment.replies.forEach(
                        async (reply) => await reply.delete()
                    );
                    await comment.delete();
                }
            });
        }

        await Post.findByIdAndDelete(post.id);

        addActionToUserHistory(
            req,
            res,
            null,
            null,
            'post',
            'remove',
            null,
            'post removed successfully'
        );
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
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

        let { title, description } = req.body;
        let imageId = null;
        let image = req.file;

        // TODO - might need to change the way I handle arrays
        let categories = JSON.parse(req.body.categories).map((catId) => catId);

        let post = req.post;
        // There are 3 cases
        // user adds image on a post that didn't have an image
        // user does not add an image to update the post
        // user updates image

        const Attachment = req.Attachment;

        // 1st case
        if (image && !post.imageId) {
            const readStream = new stream.PassThrough();
            readStream.end(image.buffer);

            const options = {
                filename: image.originalname,
                contentType: image.mimetype,
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

                addActionToUserHistory(
                    res,
                    res,
                    post._id,
                    null,
                    'post',
                    'update',
                    null,
                    post
                );
            });
            return;
        }

        // 2nd case
        if (!image) {
            post.title = title;
            post.description = description;
            post.categories = categories;

            await post.save();

            addActionToUserHistory(
                res,
                res,
                post._id,
                null,
                'post',
                'update',
                null,
                post
            );
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

        const readStream = new stream.PassThrough();
        readStream.end(image.buffer);

        const options = {
            filename: image.originalname,
            contentType: image.mimetype,
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
            addActionToUserHistory(
                res,
                res,
                post._id,
                null,
                'post',
                'update',
                null,
                post
            );
        });
        return;
    } catch (err) {
        console.error(err);
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
            .populate('author');
        // .populate({
        //     path: 'comments',
        //     model: 'Comment',
        //     populate: [
        //         {
        //             path: '_userId',
        //             select: '_id name',
        //             model: 'User',
        //         },
        //         {
        //             path: 'replies',
        //             select: 'text',
        //             model: 'Reply',
        //             populate: [
        //                 {
        //                     path: '_userId',
        //                     select: '_id name',
        //                     model: 'User',
        //                 },
        //             ],
        //         },
        //     ],
        // })
        // .populate({
        //     path: 'categories',
        //     populate: {
        //         path: '_createdFrom',
        //         select: '_id name',
        //         model: 'User',
        //     },
        // });

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
            .populate('author', 'name')
            .populate({
                path: 'comments',
                select: '_id text',
                model: 'Comment',
                populate: [
                    {
                        path: 'userId',
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
            .populate('categories', 'id title');

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

const readImg = async (req, res) => {
    try {
        const post = req.post;
        const Attachment = req.Attachment;

        const readStream = Attachment.read({ _id: post.imageId });

        readStream.pipe(res);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
    postById,
    read,
    readPostComments,
    create,
    update,
    remove,
    photo,
    listByInterests,
    listAll,
    listByCategory,
    readImg,
};
