
const axios = require('axios');
const BASE_URL = "https://control.msg91.com/api/v5/flow";
const { SMS91_AUTH_KEY } = process.env
const getHeader = () => {
    return {
        authkey: SMS91_AUTH_KEY,
        accept: 'application/json',
        'content-type': 'application/json'
    }
}

const sendOtpSms = async (mobile, otp) => {
    try {
        
        const smsBody = {
            template_id: "66efd695d6fc050cab3d6f12",
            short_url: 0,
            recipients: [{
                "mobiles": mobile,
                "var1": `${otp}`,
            }]
        }
        const { data } = await axios({
            url: BASE_URL,
            method: 'POST',
            data: JSON.stringify(smsBody),
            headers: getHeader()

        })
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}
const sendBookingConfirmedSms = async (mobile, payload) => {
    try {
        const { clientName, bookingId } = payload; 
        const smsBody = {
            template_id: "671dcd51d6fc051740508432",
            short_url: 0,
            recipients: [{
                "mobiles": mobile,
                "var1": `${clientName}`,
                "var2": `${bookingId}`
            }]
        }
        const { data } = await axios({
            url: BASE_URL,
            method: 'POST',
            data: JSON.stringify(smsBody),
            headers: getHeader()
        })
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}

const sendRideRescheduledSms = async (mobile, payload) => {
    try {
        const { clientName, bookingId, pickupDate,pickupTime } = payload;
        const smsBody = {
            template_id: "671dcdcfd6fc0534162743e2",
            short_url: 0,
            recipients: [{
                "mobiles": mobile,
                "var1": `${clientName}`,
                "var2": `${bookingId}`,
                "var3": `${pickupDate} ${pickupTime}`
            }]
        }
        const { data } = await axios({
            url: BASE_URL,
            method: 'POST',
            data: JSON.stringify(smsBody),
            headers: getHeader()
        })
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}


const sendBookingCancelledByPassengerSms = async (mobile, payload) => {
    try {
        const { clientName, bookingId } = payload;
        const smsBody = {
            template_id: "671dce7ad6fc0514d83ee873",
            short_url: 0,
            recipients: [{
                "mobiles": mobile,
                "var1": `${clientName}`,
                "var2": `${bookingId}`
            }]
        }
        const { data } = await axios({
            url: BASE_URL,
            method: 'POST',
            data: JSON.stringify(smsBody),
            headers: getHeader()
        })
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}


const sendBookingCancelledByAdminSms = async (mobile, payload) => {
    try {
        const { clientName, cancellationReason, bookingId } = payload;
        const smsBody = {
            template_id: "671dce22d6fc0517103560b3",
            short_url: 0,
            recipients: [{
                "mobiles": mobile,
                "var1": `${clientName}`,
                "var2": `${cancellationReason}`,
                "var3": `${bookingId}`
            }]
        }
        const { data } = await axios({
            url: BASE_URL,
            method: 'POST',
            data: JSON.stringify(smsBody),
            headers: getHeader()
        })
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { sendOtpSms, sendBookingConfirmedSms, sendRideRescheduledSms, sendBookingCancelledByPassengerSms, sendBookingCancelledByAdminSms };

