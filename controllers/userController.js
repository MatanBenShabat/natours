const User = require('../models/userModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getMe = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user },
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword .',
        400
      )
    );
  }

  const { name, email, photo } = req.body;

  const user = Object.assign(
    req.user,
    JSON.parse(JSON.stringify({ name, email, photo }))
  );
  const updatedUser = await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const { user } = req;

  user.active = false;
  await user.save({ validateBeforeSave: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = (req, res) => {
  res.sstatus(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead.',
  });
};
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
