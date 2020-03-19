const express = require('express');
const userControllers = require('./../controllers/userControllers');
const authController = require('./../controllers/authController');

//routes
const router = express.Router();

//Auth routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logOut);
router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

//Current User
router.patch(
  '/updatepassword',
  authController.protect,
  authController.updatePassword
);

router.get(
  '/me',
  authController.protect,
  userControllers.getMe,
  userControllers.getSingleUser
);
router.patch('/updateme', authController.protect, userControllers.updateMe);
router.delete('/deleteme', authController.protect, userControllers.deleteMe);

//Admin privileges on User
router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userControllers.getAllUsers
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userControllers.getSingleUser
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    userControllers.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userControllers.deleteUser
  );

module.exports = router;
