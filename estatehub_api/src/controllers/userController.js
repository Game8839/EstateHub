const { User, Follow } = require('../models');
const fs = require('fs');
const cloudinary = require('../utils/cloundinary');
const AppError = require('../utils/appError');

exports.updateUser = async (req, res, next) => {
  try {
    const { password, ...updateValue } = req.body;
    console.log(req.body);
    console.log('************************' + updateValue);
    if (req.files?.profileImage) {
      const profileImage = req.user.profileImage;
      const secureUrl = await cloudinary.upload(
        req.files.profileImage[0].path,
        profileImage ? cloudinary.getPublicId(profileImage) : undefined
      );
      updateValue.profileImage = secureUrl;
      fs.unlinkSync(req.files.profileImage[0].path);
    }

    if (req.files?.coverImage) {
      const coverImage = req.user.coverImage;
      const secureUrl = await cloudinary.upload(
        req.files.coverImage[0].path,
        coverImage ? cloudinary.getPublicId(coverImage) : undefined
      );
      updateValue.coverImage = secureUrl;
      fs.unlinkSync(req.files.coverImage[0].path);
    }

    await User.update(updateValue, { where: { id: req.user.id } });
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: { exclude: 'password' },
    });

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

const isfollowing = async (userId, otherId) => {
  if (userId === +otherId) {
    return 'me';
  }
  const follow = await Follow.findOne({
    where: { userFollower: userId, userBeingFollow: otherId },
  });

  if (!follow) {
    return 'notFollow';
  }
  return 'following';
};

exports.getUserFollow = async (req, res, next) => {
  try {
    const id = +req.params.id;
    const friend = await User.findOne({
      where: { id: id },
      attributes: { exclude: 'password' },
    });

    if (!friend) {
      throw new AppError('user not found', 400);
    }

    const following = await Follow.findAll({ where: { userFollower: id } });
    const followingIds = following.map((item) => {
      return item.userBeingFollowed;
    });
    const userBeingFollowed = await User.findAll({
      where: { id: followingIds },
      attributes: { exclude: 'password' },
    });
    const isFollowing = await isfollowing(req.user.id, id);

    res.status(200).json({ friend, userBeingFollowed, isFollowing });
  } catch (err) {
    next(err);
  }
};
