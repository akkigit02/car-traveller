
const axios = require('axios');
const BASE_URL = "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/";
const { SMS91_AUTH_KEY, WHATSAPP_NUMBER } = process.env
const getHeader = () => {
    return {
        authkey: SMS91_AUTH_KEY,
        accept: 'application/json',
        'content-type': 'application/json'
    }
}

const sendOtpWhatsapp = async (mobile, otp) => {
    try {
        const whatsappBody = {
            integrated_number: WHATSAPP_NUMBER,
            content_type: "template",
            "payload": {
                messaging_product: "whatsapp",
                type: "template",
                template: {
                    name: "otp_template",
                    language: {
                        "code": "en",
                        "policy": "deterministic"
                    },
                    "namespace": null,
                    "to_and_components": [
                        {
                            "to": [
                                mobile
                            ],
                            "components": {
                                "body_1": {
                                    "type": "text",
                                    "value": otp
                                },
                                "button_1": {
                                    "subtype": "url",
                                    "type": "text",
                                    "value": `${otp}`
                                }
                            }
                        }
                    ]
                }
            }
        }
        const { data } = await axios({
            url: BASE_URL,
            method: 'POST',
            data: JSON.stringify(whatsappBody),
            headers: getHeader()

        })
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { sendOtpWhatsapp };
