const { User } = require('../models');
const validator = require('validator');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const genToken = (data) => {
  return jwt.sign(data, process.env.SECRET_KEY || 'secret_key', {
    expiresIn: '30d',
  });
};

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, mobile, email, password, confirmPassword } =
      req.body;

    console.log(req.body);
    console.log(process.env.SECRET_KEY);
    if (!firstName) {
      next('please enter your name');
    }

    if (!password) {
      throw new AppError('password is required', 400);
    }
    if (password !== confirmPassword) {
      throw new AppError('password and confirm password must be matched', 400);
    }
    const isEmail = validator.isEmail(email + '');
    const isMobile = validator.isMobilePhone(mobile + '');
    if (!isEmail && !isMobile) {
      throw new AppError('Email address / Phone number is invalid ', 400);
    }

    const EmailExist = await User.findOne({ where: { email } });

    if (EmailExist !== null) {
      throw new AppError('Email address already Exist ', 400);
    }

    const MobileExist = await User.findOne({ where: { mobile } });

    if (MobileExist !== null) {
      throw new AppError('Phone number already Exist ', 400);
    }

    console.log(isEmail + ',' + isMobile);
    if (!(isEmail || isMobile)) {
      throw new AppError('Either Email or Phone number is required ', 400);
    }
    // end validate

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 9);

    const user = await User.create({
      firstName,
      lastName,
      email: isEmail ? email : null,
      mobile: isMobile ? mobile : null,
      password: hashedPassword,
    });

    const token = genToken({ id: user.id });
    console.log(user.id);
    console.log('a' + token + 'ksfs;kghsj');
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { emailOrMobile, password } = req.body;
    console.log(emailOrMobile, password);
    let user;
    if (!emailOrMobile) {
      throw new AppError('missing email or phone number ', 400);
    }

    if (!password) {
      throw new AppError('missing password', 400);
    }
    const isEmail = validator.isEmail(emailOrMobile + '');
    const isMobile = validator.isMobilePhone(emailOrMobile + '');
    console.log(isEmail);
    if (isEmail) {
      user = await User.findOne({ where: { email: emailOrMobile } });
      console.log(user);
    }
    if (isMobile) {
      user = await User.findOne({ where: { mobile: emailOrMobile } });
    }
    console.log(user);
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new AppError('Incorrect password', 400);
    }
    const token = genToken({ id: user.id });

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.getMe = (req, res, next) => {
  res.status(200).json({ user: req.user });
};
