const router = require('express').Router()

router.use('/admin', require('./admin.route'))
router.use('/auth', require('./auth.route'))
router.use('/client', require('./client.route'))



module.exports = router