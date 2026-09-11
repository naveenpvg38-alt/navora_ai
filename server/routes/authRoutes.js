const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.post('/send-otp', authController.sendOtp);
router.post('/verify-and-signup', authController.verifyAndSignup);
router.post('/signup', authController.signup);
router.post('/register', authController.signup);
router.post('/login', authController.login);
router.post('/demo-login', authController.demoLogin);
router.post('/demo', authController.demoLogin);
router.get('/me', requireAuth, authController.me);

module.exports = router;
