const router = require('express').Router()
const AuthenticationManager = require('../managers/authentication.manager')

router.post('/login', AuthenticationManager.login)
router.get('/session', AuthenticationManager.verifySession)

module.exports = router