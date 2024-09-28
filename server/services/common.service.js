
const PaymentModel = require('../models/payment.model')
const RideModel = require('../models/ride.model')
const incrementBookingNumber = async (rideId) => {
    const generateBookingNumber = (lastBookingNo) => {
        const prefix = 'DDD';
        let newCount = 1
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        if (lastBookingNo) {
            const lastYear = parseInt(lastBookingNo.substring(3, 7)); // YYYY
            const lastMonth = parseInt(lastBookingNo.substring(7, 9)); // MM
            const lastCount = parseInt(lastBookingNo.substring(9)); // ####
            newCount = (currentYear !== lastYear || currentMonth !== lastMonth) ? 1 : lastCount + 1;
        }
        const formattedMonth = String(currentMonth).padStart(2, '0');
        const formattedCount = String(newCount).padStart(4, '0');
        return `${prefix}${currentYear}${formattedMonth}${formattedCount}`;
    }
    const ride = await RideModel.find({}).sort({ createdOn: -1 }).limit(1)
    const lastBookingNo = ride[0]?.bookingNo || null
    let ID = generateBookingNumber(lastBookingNo)
    const isExist = await RideModel.exists({ bookingNo: ID })
    if (isExist) {
        ID = generateBookingNumber(lastBookingNo)
    }
    await RideModel.updateOne({ _id: rideId }, { $set: { bookingNo: ID } })
    return ID
}

const incrementInvoiceNumber = async (invoiceId) => {
    const gererateInvoiceNumber = (lastInvoiceNumber) => {
        const prefix = 'DDD';
        let newCount = 1
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        if (lastInvoiceNumber) {
            const lastMonth = parseInt(lastInvoiceNumber.substring(3, 5)); // MM
            const lastYear = parseInt(lastInvoiceNumber.substring(5, 9)); // YYYY
            const lastCount = parseInt(lastInvoiceNumber.substring(9)); // ####
            newCount = (currentYear !== lastYear || currentMonth !== lastMonth) ? 1 : lastCount + 1;
        }
        const formattedMonth = String(currentMonth).padStart(2, '0');
        const formattedCount = String(newCount).padStart(4, '0');
        return `${prefix}${formattedMonth}${currentYear}${formattedCount}`;
    }
    const payment = await PaymentModel.find({ invoiceNo: { $exists: 1 } }).sort({ createdOn: -1 }).limit(1)
    const lastInvoiceNumber = payment[0]?.invoiceNo || null
    let ID = gererateInvoiceNumber(lastInvoiceNumber)
    const isExist = await PaymentModel.exists({ invoiceNo: ID })
    if (isExist)
        ID = gererateInvoiceNumber(lastInvoiceNumber)
    await PaymentModel.updateOne({ _id: invoiceId }, { $set: { invoiceNo: ID } })
    return ID

}
module.exports = { incrementBookingNumber, incrementInvoiceNumber }