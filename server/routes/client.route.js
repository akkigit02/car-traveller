const router = require('express').Router()
const ClientManager = require('../managers/client.manager')
const { jwtUserAuthentication } = require('../utils/api-key-middleware')
// unprotected route 
router.get('/cities', ClientManager.getCities)
router.get('/address-suggestion', ClientManager.getAddressSuggestion)
router.get('/places-suggestion', ClientManager.getAddressSuggestionOnLandingPage)
router.get('/car-list', ClientManager.getCars)
// must be protected
router.post('/booking', jwtUserAuthentication, ClientManager.saveBooking)
router.get('/booking', jwtUserAuthentication, ClientManager.getBookingList)
router.get('/booking/:bookingId', jwtUserAuthentication, ClientManager.getBookingById)
router.get('/apply-coupon/:bookingId/:couponCode', jwtUserAuthentication, ClientManager.applyCopounCode)
router.post('/initiate-payment', jwtUserAuthentication, ClientManager.initiatePayment)


// router.get('/rescheduled/:bookingId', jwtUserAuthentication, ClientManager.getBookingById)
// router.get('/cancel-booking/:bookingId', jwtUserAuthentication, ClientManager.getBookingById)

router.get('/coupons', ClientManager.getCoupons)
module.exports = router