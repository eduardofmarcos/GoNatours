const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  //1) get tour data from collection

  const allTours = await Tour.find();
  //2) build template
  //3) render that template with the data from pass 1

  res.status(200).render('overview', {
    title: 'All Tours',
    allTours
  });
  //console.log('this is the route: ', req.originalUrl);
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({
    slug: req.params.slug
  }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  //console.log(tour);
  res.status(200).render('tour', {
    title: tour.name,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account!'
  });
};
