const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const upload = require('../middlewares/upload');
const bidPriceController = require('../controllers/bidPriceController');

router.route('/').post(
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 },
  ]),
  postController.createPost
);

router.get('/otherpost', postController.getOtherPost);
router.route('/comment').post(commentController.createComment);
router
  .route('/bidprice')
  .post(upload.none(), bidPriceController.createBidPrice);
router
  .route('/:postid/comment')
  .get(upload.none(), commentController.getCommentByPostId);
router
  .route('/:postid/bidprice')
  .get(upload.none(), bidPriceController.getBidPriceByPostId);
router.get('/:id', postController.getMyPost);

module.exports = router;
