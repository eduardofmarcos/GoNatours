const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createReview = catchAsync(async (req, res, next) => {
  //

  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;

  const newReview = await Review.create(req.body);

  res.status(200).json({
    status: 'success',
    data: newReview
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};

  const tourCheck = await Review.findOne({ tour: req.params.tourId });

  console.log(tourCheck);

  if (!tourCheck) {
    return next(new AppError('We couldnt find a tour with this Id!'));
  }

  if (req.params.tourId) filter = { tour: req.params.tourId };
  const allReviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    data: allReviews
  });
});
