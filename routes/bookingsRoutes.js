const express = require('express');
const authControllers = require('./../controllers/authController');
const bookingControllers = require('./../controllers/bookingController');

const router = express.Router();

router
  .route('/')
  .get(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    bookingControllers.getAllBookings
  )
  .post(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    bookingControllers.createOneBooking
  );

router
  .route('/:id')
  .get(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    bookingControllers.getSingleBooking
  )
  .patch(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    bookingControllers.updateBooking
  )
  .delete(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    bookingControllers.deleteBooking
  );

///***Checking out temporaly routes */
router.get(
  '/checkout/:tourId',
  authControllers.protect,
  bookingControllers.getCheckoutSession
);

// router.get(
//   '/checkout/:tourId',
//   authControllers.protect,
//   bookingControllers.getCheckoutSession
// );

module.exports = router;
