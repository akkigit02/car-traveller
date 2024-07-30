const router = require('express').Router()
const AdminManager = require('../managers/admin.manager')
router.get('/driver', (req, res) => {

})

router.post('/vehicle-price',AdminManager.saveVehiclePrice)
router.get('/vehicle-price',AdminManager.getVehiclePrice)
router.put('/vehicle-price',AdminManager.updateVehiclePrice)
router.delete('/vehicle-price/:id',AdminManager.deleteVehiclePrice)
router.get('/vehicle-price/:id',AdminManager.getVehiclePriceById)


module.exports = router