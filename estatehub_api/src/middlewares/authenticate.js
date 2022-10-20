const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const { User } = require('../models');

const decrypt = (input) => {
  return jwt.verify(input, process.env.SECRET_KEY || 'secret_key');
};

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    console.log(req.headers);
    if (!authorization || !authorization.startsWith('Bearer')) {
      throw new AppError('you are unauthenicated', 401);
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      throw new AppError('unauthenticated', 401);
    }

    const payload = decrypt(token);
    console.log(payload.id);

    const user = await User.findOne({
      where: { id: payload.id },
      attributes: { exclude: 'password' },
    });
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
