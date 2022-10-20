const cloudinary = require('../config/cloundinary');
exports.upload = async (path, publicId) => {
  const option = {
    use_filename: true,
    overwrite: true,
    unique_filename: false,
  };

  if (publicId) {
    option.public_id = publicId;
  }

  const res = await cloudinary.uploader.upload(path, option);
  return res.secure_url;
};

exports.getPublicId = (url) => {
  const splitSlash = url.split('/');
  const splitDot = splitSlash[splitSlash.length - 1].split('.')[0];
  return splitDot;
};
