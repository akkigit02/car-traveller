const router = require('express').Router()
const AdminManager = require('../managers/admin.manager')
const DashboardManager = require('../managers/dashboard.manager')
const { jwtUserAuthentication } = require('../utils/api-key-middleware')

router.get('/driver', (req, res) => {

})

router.post('/vehicle-price',jwtUserAuthentication ,AdminManager.saveVehiclePrice)
router.get('/vehicle-price',jwtUserAuthentication, AdminManager.getVehiclePrice)
router.put('/vehicle-price',jwtUserAuthentication, AdminManager.updateVehiclePrice)
router.delete('/vehicle-price/:id',jwtUserAuthentication, AdminManager.deleteVehiclePrice)
router.get('/vehicle-price/:id',jwtUserAuthentication, AdminManager.getVehiclePriceById)

router.post('/vehicle',jwtUserAuthentication, AdminManager.saveVehicle)
router.get('/vehicle',jwtUserAuthentication, AdminManager.getVehicle)
router.put('/vehicle',jwtUserAuthentication, AdminManager.updateVehicle)
router.delete('/vehicle/:id',jwtUserAuthentication, AdminManager.deleteVehicle)
router.get('/vehicle/:id',jwtUserAuthentication, AdminManager.getVehicleById)

router.get('/bookings',jwtUserAuthentication, AdminManager.getBookingInfo)
router.post('/bookings',jwtUserAuthentication, AdminManager.saveBooking)
router.patch('/confirm-booking/:id', jwtUserAuthentication, AdminManager.confirmBooking);

router.post('/package',jwtUserAuthentication, AdminManager.savePackage)
router.get('/package',jwtUserAuthentication, AdminManager.getPackage)
router.put('/package',jwtUserAuthentication, AdminManager.updatePackage)
router.delete('/package/:id',jwtUserAuthentication, AdminManager.deletePackage)
router.get('/package/:id',jwtUserAuthentication, AdminManager.getPackageById)

router.get('/enquire-package',jwtUserAuthentication, AdminManager.getEnquirePackage)
router.get('/enquire-contact',jwtUserAuthentication, AdminManager.getEnquireContact)

router.post('/coupons',jwtUserAuthentication, AdminManager.saveReferral)
router.get('/coupons',jwtUserAuthentication, AdminManager.getReferral)
router.put('/coupons/:id',jwtUserAuthentication, AdminManager.updateReferral)
router.delete('/coupons/:id',jwtUserAuthentication, AdminManager.deleteReferral)
router.get('/coupons/:id',jwtUserAuthentication, AdminManager.getReferralById)

router.get('/leads',jwtUserAuthentication, AdminManager.getLeads)
router.put('/leads/:id',jwtUserAuthentication, AdminManager.confirmCall)

router.get('/booking-count', jwtUserAuthentication, DashboardManager.getBookingCount)
router.get('/booking-revenue', jwtUserAuthentication, DashboardManager.getBookingRevenues)

router.get('/car-revenue', jwtUserAuthentication, DashboardManager.getBookingRevenuesByCarType)

router.get('/recent-booking', jwtUserAuthentication, DashboardManager.getRecentBooking)
router.get('/recent-lead', jwtUserAuthentication, DashboardManager.getRecentLead)

router.get('/users',jwtUserAuthentication, AdminManager.getUsers)
router.get('/users/:id',jwtUserAuthentication, AdminManager.getUserById)
router.post('/users',jwtUserAuthentication, AdminManager.saveUser)
router.put('/users/:id',jwtUserAuthentication, AdminManager.updateUser)
router.get('/user/csv-dowload',jwtUserAuthentication, AdminManager.downloadUsersCSV)
router.get('/vehicle-type/:type', jwtUserAuthentication, AdminManager.getVehicleByBookingType)

router.post('/publish-invoice', jwtUserAuthentication, AdminManager.generateFinalInvoice)
router.patch('/payment-confirmation/:paymentId', jwtUserAuthentication, AdminManager.confirmFullPayment);


router.get('/notification',jwtUserAuthentication,AdminManager.getRecentNotification)

router.put('/driver/:id',jwtUserAuthentication,AdminManager.driverAllot)


module.exports = router