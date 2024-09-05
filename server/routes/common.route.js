const router = require('express').Router()
const CommonManager = require('../managers/common.manager')
const { jwtUserAuthentication } = require('../utils/api-key-middleware')
router.get('/profile', jwtUserAuthentication, CommonManager.getProfile)
router.post('/profile', jwtUserAuthentication, CommonManager.updateProfile)
router.get('/send-otp', jwtUserAuthentication, CommonManager.sendOtp)

module.exports = router