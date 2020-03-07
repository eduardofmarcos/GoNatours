const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');

exports.createReview = catchAsync(async (req, res, next) => {
  //
  const newReview = await Review.create({
    review: req.body.review,
    rating: req.body.rating,
    tour: req.body.tour,
    user: req.user._id
  });

  res.status(200).json({
    status: 'success',
    data: newReview
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const allReviews = await Review.find();

  res.status(200).json({
    status: 'success',
    data: allReviews
  });
});
