const Tour = require("./../models/tourModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Booking = require("./../models/bookingModel");

exports.getOverview = catchAsync(async (req, res, next) => {
  //1) get tour data from collection

  const allTours = await Tour.find();
  //2) build template
  //3) render that template with the data from pass 1

  res.status(200).render("overview", {
    title: "All Tours",
    allTours
  });
  //console.log('this is the route: ', req.originalUrl);
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({
    slug: req.params.slug
  }).populate({
    path: "reviews",
    fields: "review rating user"
  });

  //checking if there is a tour
  if (!tour) {
    return next(new AppError("There is no tour with this name :)", 404));
  }
  //console.log(tour);
  res.status(200).render("tour", {
    title: tour.name,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account!"
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your account"
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  //1) find all bookings by users ID
  const bookings = await Booking.find({
    user: req.user._id
  });
  //2) find all tours based on bookings found
  const toursIds = bookings.map(el => el.tour.id);
  const allTours = await Tour.find({
    _id: { $in: toursIds }
  });

  res.status(200).render("overview", {
    title: "Your bookings",
    allTours
  });
});

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === "booking") {
    res.locals.alert =
      "Your book was successful! Please check your email for confirmation. If your booking doesn't show immediatelly, please come back later.";
  }
  next();
};
