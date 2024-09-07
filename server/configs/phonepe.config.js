

// class PhonePe {
//     // static PROD_URL = 'https://api.phonepe.com/apis/hermes/pg/v1/';
//     static UAT_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/';

//     constructor(merchantId, saltKey, saltIndex) {
//         if (!merchantId) throw new Error("You must provide a Merchant Id");
//         if (!saltKey) throw new Error("You must provide a Salt Key");
//         if (!saltIndex) throw new Error("You must provide a Salt Index");

//         this.merchantId = merchantId;
//         this.saltKey = saltKey;
//         this.saltIndex = saltIndex;
//     }

//     async paymentCall(merchantTransactionId, merchantUserId, amount, redirectUrl, callbackUrl, mobileNumber, mode = null) {
//         const payload = {
//             merchantId: this.merchantId,
//             merchantTransactionId: merchantTransactionId,
//             merchantUserId: merchantUserId,
//             amount: amount,
//             redirectUrl: redirectUrl,
//             redirectMode: "REDIRECT",
//             callbackUrl: callbackUrl,
//             mobileNumber: mobileNumber,
//             paymentInstrument: {
//                 type: "PAY_PAGE"
//             }
//         };

//         const payloadStr = JSON.stringify(payload);
//         const base64Payload = Buffer.from(payloadStr).toString('base64');
//         const hashString = base64Payload + "/pg/v1/pay" + this.saltKey;
//         const hashedValue = crypto.createHash('sha256').update(hashString).digest('hex');
//         const result = `${hashedValue}###${this.saltIndex}`;

//         const url = mode === 'UAT' ? `${PhonePe.UAT_URL}pay` : `${PhonePe.PROD_URL}pay`;

//         try {
//             const response = await axios.post(url, { request: base64Payload }, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     "accept": "application/json",
//                     "X-VERIFY": result
//                 }
//             });

//             const res = response.data;
//             console.log(res)

//             return {
//                 responseCode: 200,
//                 url: res.data.instrumentResponse.redirectInfo,
//                 msg: res.message,
//                 status: res.code
//             };

//         } catch (error) {
//             console.log(error)
//             return {
//                 responseCode: 400,
//                 error: error.message
//             };
//         }
//     }

//     async paymentStatus(merchantTransactionId, mode = null) {
//         const hashString = `/pg/v1/status/${this.merchantId}/${merchantTransactionId}${this.saltKey}`;
//         const hashedValue = crypto.createHash('sha256').update(hashString).digest('hex');
//         const result = `${hashedValue}###${this.saltIndex}`;

//         const url = mode === 'UAT' ? `${PhonePe.UAT_URL}status/${this.merchantId}/${merchantTransactionId}` : `${PhonePe.PROD_URL}status/${this.merchantId}/${merchantTransactionId}`;

//         try {
//             const response = await axios.get(url, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     "X-MERCHANT-ID": this.merchantId,
//                     "X-VERIFY": result,
//                     "accept": "application/json"
//                 }
//             });

//             const res = response.data;

//             if (res.success && res.success === '1') {
//                 return {
//                     responseCode: 200,
//                     txn: res.data.merchantTransactionId,
//                     msg: res.message,
//                     status: res.data.responseCode
//                 };
//             } else {
//                 return {
//                     responseCode: res.code,
//                     txn: '',
//                     msg: res.message,
//                     status: res.status || 'Error from PhonePe Server'
//                 };
//             }
//         } catch (error) {
//             return {
//                 responseCode: 400,
//                 error: error.message
//             };
//         }
//     }
// }

// module.exports = PhonePe;








const { default: axios } = require('axios');
const crypto=require('crypto')

const { MERCHANT_ID, MERCHANT_USER_ID, PHONE_PE_HOST_URL, SALT_INDEX, SALT_KEY } = process.env

const initiatePhonepePayment = async ({ amount, merchantTransactionId }) => {
    try {
        let payLoad = {
            merchantId: MERCHANT_ID,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: MERCHANT_USER_ID,
            amount: amount * 100,
            redirectUrl: `http://127.0.0.1:3000`,
            redirectMode: "REDIRECT",
            callbackUrl: 'http://127.0.0.1:3000',
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
    } catch (error) {
        console.log(error);
        return null
    }
}
module.exports = { initiatePhonepePayment };
