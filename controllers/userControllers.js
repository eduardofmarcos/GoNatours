const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObject = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObject[el] = obj[el];
  });
  return newObject;
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

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query) //this is where the querie from mongoose comes//
    .filter()
    .sort()
    .limitFields()
    .paginate();

  //console.log(features.query);
  const allUsers = await features.query; //entramos com uma querie no await, para pegarmos os resultados, e ele retorna outra querie/promise com resolve ou reject

  /****responses****/

  res.status(200).json({
    status: 'success',
    timeAt: req.time,
    results: allUsers.length,
    data: {
      allUsers
    }
  });
});

exports.getSingleUser = (req, res) => {
  res.status(500).json({ message: 'to implement' });
};

exports.createUser = (req, res) => {
  res.status(500).json({ message: 'to implement' });
};

exports.updateUser = (req, res) => {
  res.status(500).json({ message: 'to implement' });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({ message: 'to implement' });
};
