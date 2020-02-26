const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');
const User = require('./../models/userModel');

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
