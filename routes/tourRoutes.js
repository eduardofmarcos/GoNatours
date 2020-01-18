const express = require('express');
const tourControllers = require('./../controllers/tourControllers');

const router = express.Router();

//router.param('id', checkID);

router
  .route('/top-5-cheap')
  .get(tourControllers.aliasTopTours, tourControllers.getAllTours);

router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(tourControllers.createSingleTour);

router
  .route('/:id')
  .get(tourControllers.getSingleTour)
  .patch(tourControllers.updateTour)
  .delete(tourControllers.deleteTour);

module.exports = router;
