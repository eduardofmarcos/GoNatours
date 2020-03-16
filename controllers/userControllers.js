const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObject = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObject[el] = obj[el];
  });
  return newObject;
};

//Current user**********************************************

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};
exports.updateMe = catchAsync(async (req, res, next) => {
  //1) create a error when a user post a password data
  if (req.body.password || req.body.confirmPassword)
    return next(new AppError('You can not update the password here', 400));

  //2)filter the object fields to update
  const filteredBody = filterObj(req.body, 'name', 'email');

  //3)update the user documents
  const userToUpdate = await User.findByIdAndUpdate(
    req.user._id,
    filteredBody,
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).json({
    status: 'success',
    user: userToUpdate
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

//ADMIN USER FUNCTIONS*************************************************************
exports.getAllUsers = factory.getAll(User);

exports.getSingleUser = factory.getOne(User);

//DO NOT UPDATE PASSWORD IN THIS ROUTE!!!!.********** */
exports.updateUser = factory.updateOne(User);
//*************************************************** */
exports.deleteUser = factory.deleteOne(User);
