const router = require('express').Router()
const AuthenticationManager = require('../managers/authentication.manager')

router.post('/login', AuthenticationManager.login)
router.get('/session', AuthenticationManager.verifySession)

router.post('/signup', AuthenticationManager.signup)
router.post('/verify-otp', AuthenticationManager.verifyOtp)
// Forgot password, OTP verification for password reset, and password reset routes
// router.post('/forgot-password', AuthenticationManager.forgotPassword);
// router.post('/verify-password-reset-otp', AuthenticationManager.verifyPasswordResetOtp);
// router.post('/reset-password', AuthenticationManager.resetPassword);
// router.post('/change-password', AuthenticationManager.changePassword);

module.exports = router