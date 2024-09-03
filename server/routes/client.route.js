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
module.exports = router