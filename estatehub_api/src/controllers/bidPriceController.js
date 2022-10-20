const AppError = require('../utils/appError');
const { User, Post, Bookmark, Comment, BidPrice } = require('../models');

exports.createBidPrice = async (req, res, next) => {
  try {
    const { postId, price } = req.body;
    const data = { userId: req.user.id };

    console.log(req.body);

    if (!price || !price.trim()) {
      throw new AppError('price is required', 400);
    }

    if (isNaN(price)) {
      throw new AppError('price must be a number', 400);
    }

    data.price = price;
    if (!postId) {
      throw new AppError('postId is required', 400);
    }
    data.postId = postId;

    const post = await Post.findOne({ where: { id: postId } });
    console.log(post);
    if (price > post.currentPrice) {
      Post.update({ currentPrice: price }, { where: { id: postId } });
    }

    const newBidPrice = await BidPrice.create(data);
    const createdBidPrice = await BidPrice.findOne({
      where: { id: newBidPrice.id },
      include: { model: User, attributes: { exclude: 'password' } },
    });
    res.status(201).json({ createdBidPrice });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getBidPriceByPostId = async (req, res, next) => {
  try {
    const { postid } = req.params;
    // const comment = Comment.findAll();
    const bidPrice = await BidPrice.findAll({
      where: { postId: postid },
      include: { model: User, attributes: { exclude: 'password' } },
    });
    res.status(201).json({ bidPrice });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
