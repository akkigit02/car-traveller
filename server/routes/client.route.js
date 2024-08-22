const router = require('express').Router()
const ClientManager = require('../managers/client.manager')

router.get('/cities', ClientManager.getCities)
router.get('/address-suggestion', ClientManager.getAddressSuggestion)
router.get('/places-suggestion', ClientManager.getAddressSuggestionOnLandingPage)
router.get('/car-list', ClientManager.getCars)
router.post('/booking', ClientManager.addBooking)
router.get('/booking', ClientManager.getBooking)
router.get('/passanger-booking/:id', ClientManager.getBookingByPasssengerId)
router.put('/cancel-booking/:id', ClientManager.cancelBooking)
router.get('/booking-details/:bookingId', ClientManager.getBookingDeatils)
module.exports = router