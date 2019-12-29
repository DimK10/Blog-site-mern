const formidable = require('formidable');
const _ = require('lodash');
const mongoose = require('mongoose');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.commentById = (req, res, next, id) => {
    Comment.findById(id)
    .populate('_postId')
    .populate('_userId')
    .populate('replies')
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

exports.read = (req, res) => {
    return res.json(req.comment);
};

exports.create = (req, res) => {
    let form = formidable.IncomingForm();

    form.parse(req, (err, fields) => {
        if(err) {
            return res.status(400).json({
                err
            });
        };
    });
};