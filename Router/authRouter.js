const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const authMiddleware = require('../middleware/authMiddleware');
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/edit_profile', authMiddleware, authController.getEditProfile);
router.post('/update_profile', authController.updateProfile);


router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOTP);


module.exports = router;