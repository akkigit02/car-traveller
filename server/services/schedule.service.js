
const { getDateAndTimeString } = require('../utils/format.util');
const moment = require('moment')
const schedule = require('node-schedule')
const RideModel = require('../models/ride.model')



const bookigSchedule = async (bookingId) => {
try {
    
    const ride = await RideModel.findOne({ _id: bookingId}, {pickupDate: 1, pickupTime: 1})
    const dateString = getDateAndTimeString(ride?.pickupDate, ride?.pickupTime)
    let pickUpDate = moment(dateString, "DD/MM/YYYY hh:mm A")
    let date = new Date(pickUpDate)
    console.log(date,dateString)
    date.setMinutes(date.getMinutes() - 60)

    schedule.scheduleJob(bookingId?.toString, date, function(){
        console.log('The world is going to end today.');
      });
} catch (error) {
    console.log(error)
}
}


module.exports = {
    bookigSchedule
}