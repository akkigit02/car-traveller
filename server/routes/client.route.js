const router = require('express').Router()
const ClientManager = require('../managers/client.manager')

router.get('/cities', ClientManager.getCities)
router.get('/car-list', ClientManager.getCars)

module.exports = router