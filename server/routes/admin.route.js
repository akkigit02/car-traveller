const router = require('express').Router()
const AdminManager = require('../managers/admin.manager')
router.get('/driver', (req, res) => {

})

router.post('/vehicle-price',AdminManager.saveVehiclePrice)
router.get('/vehicle-price',AdminManager.getVehiclePrice)
router.put('/vehicle-price',AdminManager.updateVehiclePrice)
router.delete('/vehicle-price/:id',AdminManager.deleteVehiclePrice)
router.get('/vehicle-price/:id',AdminManager.getVehiclePriceById)

router.post('/vehicle',AdminManager.saveVehicle)
router.get('/vehicle',AdminManager.getVehicle)
router.put('/vehicle',AdminManager.updateVehicle)
router.delete('/vehicle/:id',AdminManager.deleteVehicle)
router.get('/vehicle/:id',AdminManager.getVehicleById)

router.get('/booking',AdminManager.getBookingInfo)

router.post('/package',AdminManager.savePackage)
router.get('/package',AdminManager.getPackage)
router.put('/package',AdminManager.updatePackage)
router.delete('/package/:id',AdminManager.deletePackage)
router.get('/package/:id',AdminManager.getPackageById)

router.get('/enquire-package',AdminManager.getEnquirePackage)

router.post('/referral',AdminManager.saveReferral)
router.get('/referral',AdminManager.getReferral)
router.put('/referral',AdminManager.updateReferral)
router.delete('/referral/:id',AdminManager.deleteReferral)
router.get('/referral/:id',AdminManager.getReferralById)


module.exports = router