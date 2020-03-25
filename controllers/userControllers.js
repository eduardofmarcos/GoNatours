const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, 'public/img/users/');
//   },
//   filename: (req, file, callback) => {
//     const ext = file.mimetype.split('/')[1];
//     callback(null, `user-${req.user._id}-${Date.now()}.${ext}`);
//   }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new AppError('The file is not support. Only images!', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

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
  //console.log(req);
  //1) create a error when a user post a password data
  if (req.body.password || req.body.confirmPassword)
    return next(new AppError('You can not update the password here', 400));

  //2)filter the object fields to update
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

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
