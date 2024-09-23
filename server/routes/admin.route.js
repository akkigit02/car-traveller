const router = require('express').Router()
const AdminManager = require('../managers/admin.manager')
const DashboardManager = require('../managers/dashboard.manager')
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

router.get('/bookings',AdminManager.getBookingInfo)
router.post('/bookings',AdminManager.saveBooking)
router.patch('/confirm-booking/:id', AdminManager.confirmBooking);

router.post('/package',AdminManager.savePackage)
router.get('/package',AdminManager.getPackage)
router.put('/package',AdminManager.updatePackage)
router.delete('/package/:id',AdminManager.deletePackage)
router.get('/package/:id',AdminManager.getPackageById)

router.get('/enquire-package',AdminManager.getEnquirePackage)

router.post('/coupons',AdminManager.saveReferral)
router.get('/coupons',AdminManager.getReferral)
router.put('/coupons/:id',AdminManager.updateReferral)
router.delete('/coupons/:id',AdminManager.deleteReferral)
router.get('/coupons/:id',AdminManager.getReferralById)

router.get('/leads',AdminManager.getLeads)
router.put('/leads/:id',AdminManager.confirmCall)

router.get('/booking-count', DashboardManager.getBookingCount)
router.get('/booking-revenue', DashboardManager.getBookingRevenues)

router.get('/car-revenue', DashboardManager.getBookingRevenuesByCarType)

router.get('/recent-booking', DashboardManager.getRecentBooking)
router.get('/recent-lead', DashboardManager.getRecentLead)

router.get('/users',AdminManager.getUsers)
router.get('/users/:id',AdminManager.getUserById)
router.get('/vehicle-type/:type', AdminManager.getVehicleByBookingType)


module.exports = router