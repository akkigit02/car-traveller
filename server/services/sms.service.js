
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
            template_id: "66f4e7ddd6fc056d985b6a63",
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
        const { name, bookingId } = payload;
        const smsBody = {
            template_id: "66f10da7d6fc053cb465c262",
            short_url: 0,
            recipients: [{
                "mobiles": mobile,
                "var1": `${name}`,
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


module.exports = { sendOtpSms, sendBookingConfirmedSms };

