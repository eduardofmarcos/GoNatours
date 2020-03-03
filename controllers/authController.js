const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError('Invalid fields - provided an email and password!', 400)
    );
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect user or password!', 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    //console.log(token);
  }

  if (!token) {
    return next(new AppError('Unauthorized', 401));
  }
  //verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //checking if the user exist
  const currentUser = await User.findById(decoded.id);

  if (!currentUser)
    return next(
      new AppError('The user belonging to this token does no longer exist!'),
      401
    );

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('The user has changed the password recently!', 401)
    );
  }

  //Granted Access to protect route
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to this action!', 403)
      );
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //Get user on posted email
  const user = await User.findOne({ email: req.body.email });
  //check if users exists
  if (!user) return next(new AppError('There is no user with this email', 404));
  //generate the random reset token email
  const resetToken = user.createResetPasswordToken();
  user.save({ validateBeforeSave: false });
  //sending the email to the user

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Please submit a patch request with your new password and new password confirm to
  : ${resetUrl}\n If you did not forget your password please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token send to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save({ validateBeforeSave: false });

    return next(new AppError(err, 500));
  }
});
//exports.resetPassword = (req, res, next);
