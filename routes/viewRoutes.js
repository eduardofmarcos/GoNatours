const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoogedIn, viewController.getOverview);

router.get('/tour/:slug', authController.isLoogedIn, viewController.getTour);

router.get('/login', authController.isLoogedIn, viewController.getLoginForm);

router.get('/me', authController.protect, viewController.getAccount);

module.exports = router;
