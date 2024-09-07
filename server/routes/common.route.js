const router = require('express').Router()
const CommonManager = require('../managers/common.manager')
const { jwtUserAuthentication } = require('../utils/api-key-middleware')
router.get('/profile', jwtUserAuthentication, CommonManager.getProfile)
router.post('/profile', jwtUserAuthentication, CommonManager.updateProfile)
router.get('/send-otp', jwtUserAuthentication, CommonManager.sendOtp)
router.get('/send-msg', CommonManager.sendWhatsappMessage)
router.get('/get-whatsapp', CommonManager.getWhatsappImage)

module.exports = router