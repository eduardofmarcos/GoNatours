const express = require('express');
const tourControllers = require('./../controllers/tourControllers');
const authController = require('./../controllers/authController');
// const reviewController = require('./../controllers/reviewController');
const reviewRoutes = require('./../routes/reviewRoutes');

const router = express.Router();

//router.param('id', checkID);

router.use('/:tourId/reviews', reviewRoutes);

router
  .route('/top-5-cheap')
  .get(tourControllers.aliasTopTours, tourControllers.getAllTours);

router.route('/tour-stats').get(tourControllers.getTourStats);
router.route('/get-month-plan/:year').get(tourControllers.getMonthPlan);

router
  .route('/')
  .get(authController.protect, tourControllers.getAllTours)
  .post(tourControllers.createSingleTour);

router
  .route('/:id')
  .get(tourControllers.getSingleTour)
  .patch(tourControllers.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTour
  );

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

module.exports = router;
