const Category = require('../models/category');
const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.categoryById = (req, res, next, id) => {
    Category.findById(id)
    .populate('_createdFrom')
    .exec((err, category) => {
        if(err || !category) {
            return res.status(400).json({
                err: 'Category does not exist'
            });
        };


        req.category = category;
        next();
    });
};

exports.create = (req, res) => {
    // console.log('req.body', req.body);
    // console.log('req.profile ', req.profile);
    // console.log('spread ', {...req.body, _createdFrom: req.profile._id});

    const category = new Category({...req.body, _createdFrom: req.profile._id});
    category.save((err, data) => {
        if(err) {
            return res.status(400).json({
                err
            });
        };
        res.json(data);
    })
}

exports.read = (req, res) => {
    return res.json(req.category);
}

exports.update = (req, res) => {
    const category = req.category;
    const { title, about } = req.body;

    category.title = title;
    category.about = about;

    category.save((err, result) => {
        if(err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        };

        res.json(result);
    });
};

exports.remove = (req, res) => {
    const category = req.category;
    const isAllowed = req.isAllowed;
    console.log('isAllowed ', isAllowed);
    if(isAllowed) {
        category.remove((err, result) => {
            if(err) {
                return res.status(400).json({
                    err: errorHandler(err)
                });
            };
    
            res.json({
                message: 'Category deleted successfully'
            });
        });
    };
};

exports.list = (req, res) => {
    Category.find().populate('_createdFrom', 'name email', User).exec((err, categories) => {
        if(err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        };
        res.json(categories);
    });
};

