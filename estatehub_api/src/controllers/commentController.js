const AppError = require('../utils/appError');
const { User, Post, Bookmark, Comment } = require('../models');

exports.createComment = async (req, res, next) => {
  try {
    const { postId, comment } = req.body;
    const data = { userId: req.user.id };

    console.log(req.body);

    if (!comment || !comment.trim()) {
      throw new AppError('comment is required', 400);
    }

    data.comment = comment;
    if (!postId) {
      throw new AppError('postId is required', 400);
    }
    data.postId = postId;

    const newComment = await Comment.create(data);
    const cretaedComment = await Comment.findOne({
      where: { id: newComment.id },
      include: { model: User, attributes: { exclude: 'password' } },
    });
    res.status(201).json({ cretaedComment });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getCommentByPostId = async (req, res, next) => {
  try {
    const { postid } = req.params;
    // const comment = Comment.findAll();
    const comment = await Comment.findAll({
      where: { postId: postid },
      include: { model: User, attributes: { exclude: 'password' } },
    });
    res.status(201).json({ comment });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
