const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');

const commentController = require('../controllers/commentController');
router
  .route('/:postid')
  .get(upload.none(), commentController.getCommentByPostId);
module.exports = router;
