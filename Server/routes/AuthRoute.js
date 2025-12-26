const express = require('express');
const router = express.Router();
const { login, resendOtp, logout, forgotPassword, resetPassword, checkLoginUser } = require("../controllers/AuthController");
const { userVerification } = require('../middlewares/AuthMiddleware');

router.post('/login', login);
router.post('/resend-otp', resendOtp);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/check', userVerification, checkLoginUser);

module.exports = router