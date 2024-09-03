const router = require('express').Router()
const CommonManager = require('../managers/common.manager')
const { jwtUserAuthentication } = require('../utils/api-key-middleware')
router.get('/profile',jwtUserAuthentication, CommonManager.getUserProfile)

module.exports = router