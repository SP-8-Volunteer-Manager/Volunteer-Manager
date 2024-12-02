// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
// Route for user exists check
router.post('/checkuserexists', authController.checkuserexists);

// Route for user signup
router.post('/signup', authController.signup);
router.post('/createadminuser', authController.createAdminUser);

// Route for user login
router.post('/login', authController.login);
// Route for user logout
router.post('/logout', authController.logout);

router.post('/refreshToken', authController.refreshToken);
// Route for password reset
router.post('/forgot-password', authController.forgotPassword)
router.post('/updatePassword',authController.updatePassword)


module.exports = router; //  sure to export the router
