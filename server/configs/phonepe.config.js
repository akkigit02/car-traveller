
const axios = require('axios');
const crypto = require('crypto')

const { MERCHANT_ID, MERCHANT_USER_ID, PHONE_PAY_REDIRECT, PHONE_PE_HOST_URL, SALT_INDEX, SALT_KEY } = process.env

const initiatePhonepePayment = async ({ amount, merchantTransactionId }) => {
    try {
        let payLoad = {
            merchantId: MERCHANT_ID,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: MERCHANT_USER_ID,
            amount: amount * 100,
            redirectUrl: `${PHONE_PAY_REDIRECT}/${merchantTransactionId}`,
            redirectMode: "REDIRECT",
            callbackUrl: `${PHONE_PAY_REDIRECT}/${merchantTransactionId}`,
            paymentInstrument: { type: "PAY_PAGE" }
        };

        // make base64 encoded payload
        let bufferObj = Buffer.from(JSON.stringify(payLoad), "utf8");
        let base64EncodedPayload = bufferObj.toString("base64");

        let string = base64EncodedPayload + "/pg/v1/pay" + SALT_KEY;
        const sha256_val = crypto.createHash('sha256').update(string).digest('hex');
        let xVerifyChecksum = sha256_val + "###" + SALT_INDEX;

        const { data } = await axios.post(`${PHONE_PE_HOST_URL}/pg/v1/pay`,
            {
                request: base64EncodedPayload,
            },
            {
                headers: {
                    "X-Verify": xVerifyChecksum,
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
        console.log(JSON.stringify(data))
        return data
    } catch (error) {
        console.log(error);
        return null
    }
}
const chackStatusPhonepePayment = async ({ merchantTransactionId }) => {
    try {
        const string = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + SALT_KEY;
        const sha256_val = crypto.createHash('sha256').update(string).digest('hex');
        const xVerifyChecksum = sha256_val + "###" + SALT_INDEX;
        const { data } = await axios({
            url: `${PHONE_PE_HOST_URL}/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`,
            method: 'GET',
            headers: {
                "X-Verify": xVerifyChecksum,
                "X-MERCHANT-ID": MERCHANT_ID,
                accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        console.log(JSON.stringify(data))
        return data
    } catch (error) {
        console.log(error);
        return null
    }
}
module.exports = { initiatePhonepePayment, chackStatusPhonepePayment };
