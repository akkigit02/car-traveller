const router = require('express').Router()

router.use('/admin', require('./admin.route'))
router.use('/auth', require('./auth.route'))
router.use('/client', require('./client.route'))
router.use('/common', require('./common.route'))


module.exports = router