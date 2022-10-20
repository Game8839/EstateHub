const express = require('express');
const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');
const router = express.Router();

const userController = require('../controllers/userController');

const {
  toggleFollow,
  getAllMyFollow,
  getAllMyFollower,
} = require('../controllers/followController');

router.patch(
  '/',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  userController.updateUser
);

router.post('/follow/:id/', toggleFollow);
router.get('/myfollow/:id/', getAllMyFollow);
router.get('/myfollower/:id/', getAllMyFollower);
router.get('/:id/friends', userController.getUserFollow);
// router.get('/me', authenticate, authController.getMe);

module.exports = router;
