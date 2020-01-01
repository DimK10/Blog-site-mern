const express = require ('express');
const router = express.Router ();

const {
  replyById,
  createToComment,
  createToReply,
  update,
  remove,
} = require ('../controllers/reply');

const { requireSignin, isAllowedToDeleteReply } = require('../controllers/auth');