const Category = require('../models/category');
const Post = require('../models/post');
const User = require('../models/user');

const categoryById = async (req, res, next, id) => {
    try {
        let category = await Category.findById(id).populate('createdFrom');

        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        req.category = category;

        next();
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

const create = async (req, res) => {
    try {
        let { title, about } = req.body;

        let category = new Category({
            title,
            about,
        });

        await category.save();

        res.json(category);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

const read = (req, res) => {
    return res.json(req.category);
};

const update = async (req, res) => {
    try {
        const category = req.category;
        const { title, about } = req.body;

        category.title = title;
        category.about = about;

        await category.save();
        res.json(category);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

const remove = async (req, res) => {
    try {
        let category = req.category;

        const allowed = req.isAllowed;

        if (!allowed) {
            return res
                .status(403)
                .json({ msg: 'You are not allowed to perform this action' });
        }

        category.posts.foreach(async (postId) => {
            let post = await Post.findById(postId);
            let removeIndex = post.categories.indexOf(category._id);
            post.categories.splice(removeIndex, 1);

            await post.save();
        });
        res.json({ msg: 'Category was removed successfully' });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

const list = async (req, res) => {
    try {
        let categories = await Category.find().populate(
            'createdFrom',
            'name email',
            User
        );

        res.json(categories);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

module.exports = {
    categoryById,
    create,
    read,
    update,
    remove,
    list,
};
