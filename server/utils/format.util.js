const moment = require('moment')
const RESCHEDULE_TIME = 90 // in minutes
const formatDateAndTime = (date, format = 'MM/DD/yyyy hh:mm A') => {
    if (!date) return "";
    let _date = new Date(date)
    return _date instanceof Date && !isNaN(_date) ? moment(date).format(format) : ""
};
const isSchedulabel = (dateObj, time) => {
    const pickupDateString = getDateAndTimeString(dateObj, time)
    const pickUpDate = moment(pickupDateString, "DD/MM/yyyy hh:mm A").toDate();
    const curentDate = new Date()
    const diifrence = pickUpDate - curentDate
    if (diifrence < 0)
        return true
    console.log(pickUpDate, curentDate, diifrence, (RESCHEDULE_TIME * 60 * 1000), diifrence > (RESCHEDULE_TIME * 60 * 1000))
    return diifrence < (RESCHEDULE_TIME * 60 * 1000)
}
const getDateAndTimeString = (dateObj, time) => {
    return `${dateObj.date}/${dateObj.month}/${dateObj.year}${time ? (' ' + time) : ''}`
}

function roundToDecimalPlaces(number, decimalPlaces = 2) {
    if (!number) return 0;
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(number * factor) / factor;
}




module.exports = {
    formatDateAndTime,
    isSchedulabel,
    getDateAndTimeString,
    roundToDecimalPlaces,
}