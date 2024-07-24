const router = require('express').Router()

router.use('/admin', require('./admin.route'))

export default router