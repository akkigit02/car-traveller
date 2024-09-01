import moment from 'moment'
import { isAfter } from 'date-fns'
const formatDateAndTime = (date, format = 'MM/DD/yyyy hh:mm A') => {
    if (!date) return "";
    let _date = new Date(date)
    return _date instanceof Date && !isNaN(_date) ? moment(date).format(format) : ""
};
const checkTheDateDiifrence = (dateObj, time) => {
    const pickupDateString = getDateAndTimeString(dateObj, time)
    const pickUpDate = moment(pickupDateString, "DD/MM/yyyy hh:mm A").toDate();
    const curentDate = new Date()
    curentDate.setMinutes(curentDate.getMinutes() + 60)
    return isAfter(pickUpDate, curentDate)
}
const getDateAndTimeString = (dateObj, time) => {
    return `${dateObj.date}/${dateObj.month}/${dateObj.year}${time ? (' ' + time) : ''}`
}



export {
    formatDateAndTime,
    checkTheDateDiifrence,
    getDateAndTimeString
}