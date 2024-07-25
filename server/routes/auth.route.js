const router = require('express').Router()
const AuthenticationManager = require('../managers/authentication.manager')

router.get('/login', AuthenticationManager.login)

module.exports = router