const router = require('express').Router()
const AuthenticationManager = require('../managers/authentication.manager')

router.post('/login', AuthenticationManager.login)
router.get('/session', AuthenticationManager.verifySession)

router.post('/signup', AuthenticationManager.signup)
router.post('/send-otp', AuthenticationManager.sendOtp)
router.post('/verify-otp', AuthenticationManager.verifyOtp)

module.exports = router