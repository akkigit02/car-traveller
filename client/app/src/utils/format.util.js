import moment from 'moment'
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



export {
    formatDateAndTime,
    isSchedulabel,
    getDateAndTimeString
}