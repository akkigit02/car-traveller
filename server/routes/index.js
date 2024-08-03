const router = require('express').Router()

router.use('/admin', require('./admin.route'))
router.use('/auth', require('./auth.route'))



module.exports = router