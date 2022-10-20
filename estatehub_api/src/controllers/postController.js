const AppError = require('../utils/appError');
const { User, Post, Bookmark, Comment } = require('../models');
const fs = require('fs');
const { Op } = require('sequelize');
const cloudinary = require('../utils/cloundinary');

exports.createPost = async (req, res, next) => {
  try {
    const {
      title,
      area,
      location,
      position,
      description,
      currentPrice,
      isTranferFee,
      estateType,
    } = req.body;
    console.log(req);
    // console.log(req.files);

    if (!title || !title.trim()) {
      throw new AppError('Title is required', 400);
    }

    const data = { userId: req.user.id };
    if (title && title.trim()) {
      data.title = title;
    }

    if (!area || !area.trim() || isNaN(+area)) {
      throw new AppError('Area is required', 400);
    }
    if (area && typeof +area === 'number') {
      data.area = area;
    }

    if (!location || !location.trim()) {
      throw new AppError('Please specify the location', 400);
    }
    if (location && location.trim()) {
      data.location = location;
    }
    if (position && position.trim()) {
      data.position = position;
    }

    if (!description || !description.trim()) {
      throw new AppError('Please specify the description', 400);
    }
    if (description && description.trim()) {
      data.description = description;
    }

    if (!currentPrice || !currentPrice.trim() || isNaN(+currentPrice)) {
      throw new AppError('Please specify the start bid price', 400);
    }
    if (currentPrice && typeof +area === 'number') {
      data.currentPrice = currentPrice;
    }
    if (typeof !!isTranferFee !== 'boolean') {
      throw new AppError(
        'Please specify whether the transfer fee is included',
        400
      );
    }
    if (typeof !!isTranferFee === 'boolean') {
      data.isTranferFee = isTranferFee;
    }
    if (['ns4', 'ns3k', 'ns3', 'spk01'].indexOf(estateType) === -1) {
      throw new AppError('please specify correct estateType', 400);
    }
    data.estateType = estateType;

    if (req.files?.image) {
      const image = req.files.image.filename;
      console.log(image);
      const secureUrl = await cloudinary.upload(
        req.files.image[0].path,
        image ? cloudinary.getPublicId(image) : undefined
      );
      data.image = secureUrl;
      fs.unlinkSync(req.files.image[0].path);
    }

    if (req.files?.document) {
      const document = req.files.document.filename;
      const secureUrl = await cloudinary.upload(
        req.files.document[0].path,
        document ? cloudinary.getPublicId(document) : undefined
      );
      data.document = secureUrl;
      fs.unlinkSync(req.files.document[0].path);
    }
    const newPost = await Post.create(data);
    const post = await Post.findOne({
      where: { id: newPost.id },
      attributes: { exclude: 'userId' },
      include: [
        { model: User, attributes: { exclude: 'password' } },
        { model: Bookmark },
        {
          model: Comment,

          include: { model: User, attributes: { exclude: 'password' } },
        },
      ],
    });
    res.status(201).json({ post });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.getMyPost = async (req, res, next) => {
  try {
    const id = req.params.id;
    const myposts = await Post.findAll({
      where: { userId: id },
      include: [
        { model: User, attributes: { exclude: 'password' } },
        { model: Bookmark },
        {
          model: Comment,

          include: { model: User, attributes: { exclude: 'password' } },
        },
      ],
    });

    res.status(201).json({ myposts });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.getOtherPost = async (req, res, next) => {
  try {
    const id = req.user.id;
    console.log(id);
    const otherposts = await Post.findAll({
      where: { userId: { [Op.ne]: id } },
      include: [
        { model: User, attributes: { exclude: 'password' } },
        Bookmark,
        {
          model: Comment,
          include: { model: User, attributes: { exclude: 'password' } },
        },
      ],
    });

    res.status(201).json({ otherposts });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};
