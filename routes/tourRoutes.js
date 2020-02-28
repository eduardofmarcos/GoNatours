const express = require('express');
const tourControllers = require('./../controllers/tourControllers');
const authController = require('./../controllers/authController');

const router = express.Router();

//router.param('id', checkID);

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
  .delete(tourControllers.deleteTour);

module.exports = router;
