const router = require('express').Router()
const ClientManager = require('../managers/client.manager')

router.get('/cities', ClientManager.getCities)

module.exports = router