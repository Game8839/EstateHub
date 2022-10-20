const { Follow, User } = require('../models');

exports.toggleFollow = async (req, res, next) => {
  try {
    //setlect * from likes where user_id = req.use.id and post_id = id

    if (req.user.id === +req.params.id) {
      return res.status(200).json({ comment: 'cannot follow yourself' });
    }
    const existFollow = await Follow.findOne({
      where: { userFollower: req.user.id, userBeingFollow: req.params.id },
    });
    if (existFollow) {
      await existFollow.destroy();
      return res.status(200).json({ comment: null });
    }

    const Following = await Follow.create({
      userFollower: req.user.id,
      userBeingFollow: req.params.id,
    });
    res.status(201).json({ Following });
  } catch (err) {
    next(err);
  }
};

exports.getAllMyFollow = async (req, res, next) => {
  try {
    console.log(req.params.id);

    const myFollow = await Follow.findAll({
      where: { userFollower: +req.params.id },
      include: [
        {
          model: User,

          attributes: { exclude: 'password' },
          as: 'UserBeingFollowed',
        },
      ],
    });

    res.status(201).json({ myFollow });
  } catch (err) {
    next(err);
  }
};

exports.getAllMyFollower = async (req, res, next) => {
  try {
    console.log(req.params.id);

    const myFollowers = await Follow.findAll({
      where: { userBeingFollow: +req.params.id },
      include: [
        {
          model: User,

          attributes: { exclude: 'password' },
          as: 'UserFollower',
        },
      ],
    });

    res.status(201).json({ myFollowers });
  } catch (err) {
    next(err);
  }
};
