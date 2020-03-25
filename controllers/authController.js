const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  //remove the password of output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
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

  //const token = signToken(newUser._id);

  //console.log(newUser);

  let url = `${req.protocol}://${req.get('host')}/me`;
  //console.log(req.get('host'));

  if (req.get('host') === '127.0.0.1:3000') {
    url = `${req.protocol}://localhost:3000/me`;
  }

  //console.log(url);
  createSendToken(newUser, 201, res);
  await new Email(newUser, url).sendWelcome();

  // res.status(201).json({
  //   status: 'success',
  //   token,
  //   data: {
  //     user: newUser
  //   }
  // });
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

  //const token = signToken(user._id);

  createSendToken(user, 200, res);

  // res.status(200).json({
  //   status: 'success',
  //   token
  // });
});

exports.logOut = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({
    status: 'success',
    message: 'Logged out'
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    //console.log(token);
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
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
  res.locals.user = currentUser;
  next();
});

//only for render pages. No erroes here
exports.isLoogedIn = async (req, res, next) => {
  //verify token
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      //checking if the user exist
      const currentUser = await User.findById(decoded.id);

      if (!currentUser) return next();

      //checkig if user has changed password
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      //There is a logged in user
      //each pug template has access to res.locals variable
      res.locals.user = currentUser;

      return next();
    } catch (err) {
      return next();
    }
  }

  next();
};

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

  try {
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetUrl).sendPasswordReset();
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

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1)get user based on token

  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: {
      $gt: Date.now()
    }
  });
  //2)if token has not expired and there is a user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid', 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //3)update changedPasswordAt property of the current user

  //4)log the user in, send the JWT to the client
  //const token = signToken(user._id);
  createSendToken(user, 200, res);
  // res.status(200).json({
  //   status: 'success',
  //   token
  // });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1) get user from the collection
  const user = await User.findById(req.user._id).select('+password');
  //console.log(req.user.id);
  //console.log(req.user._id);
  const { currentPassword } = req.body;

  //console.log(user);
  //2) check if the posted password is correct
  if (!user || !(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong!', 401));
  }

  //3) if so, then update the password
  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmNewPassword;
  await user.save();

  //4) log the user in, send the JWT to user

  //const token = signToken(user._id);
  createSendToken(user, 200, res);
  // res.status(200).json({
  //   status: 'success',
  //   token
  // });
});
