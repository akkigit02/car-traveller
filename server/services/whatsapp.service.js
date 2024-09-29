
const axios = require('axios');
const BASE_URL = "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/";
const contact = '+91 9090404005', website = "www.dddcabs.com"
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
const sendBookingConfirmWhatsapp = async (mobile, payload) => {
    try {
        const { clientName, bookingId, pickupLocation, bookingType, dropLocation, pickupDate, pickupTime, vehicleType } = payload

        const whatsappBody = {
            integrated_number: WHATSAPP_NUMBER,
            content_type: "template",
            "payload": {
                messaging_product: "whatsapp",
                type: "template",
                template: {
                    name: "booking_confirmation",
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
                                    "value": clientName
                                },
                                "body_2": {
                                    "type": "text",
                                    "value": bookingId
                                },
                                "body_3": {
                                    "type": "text",
                                    "value": bookingType,
                                },
                                "body_4": {
                                    "type": "text",
                                    "value": pickupLocation,
                                },
                                "body_5": {
                                    "type": "text",
                                    "value": dropLocation,
                                },
                                "body_6": {
                                    "type": "text",
                                    "value": `${pickupDate} ${pickupTime}`,
                                },
                                "body_7": {
                                    "type": "text",
                                    "value": vehicleType,
                                },
                                "body_8": {
                                    "type": "text",
                                    "value": contact,
                                },
                                "body_9": {
                                    "type": "text",
                                    "value": website,
                                },
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

const sendDriverAllotedWhatsapp = async (mobile, payload) => {
    try {
        const { clientName, bookingId, pickupLocation, bookingType, dropLocation, pickupDate, driverName, driverContact, vehichleType, vehicleNo } = payload
        const whatsappBody = {
            integrated_number: WHATSAPP_NUMBER,
            content_type: "template",
            payload: {
                messaging_product: "whatsapp",
                type: "template",
                template: {
                    name: "driver_alloted",
                    language: {
                        code: "en",
                        policy: "deterministic"
                    },
                    namespace: null,
                    to_and_components: [
                        {
                            to: [mobile],
                            components: {
                                body_1: { type: "text", value: clientName },
                                body_2: { type: "text", value: bookingId },
                                body_3: { type: "text", value: bookingType },
                                body_4: { type: "text", value: pickupLocation },
                                body_5: { type: "text", value: dropLocation },
                                body_6: { type: "text", value: `${pickupDate} ${pickupDate}` },
                                body_7: { type: "text", value: driverName },
                                body_8: { type: "text", value: driverContact },
                                body_9: { type: "text", value: vehichleType },
                                body_10: { type: "text", value: vehicleNo },
                                body_11: { type: "text", value: contact },
                                body_12: { type: "text", value: website }
                            }
                        }
                    ]
                }
            }
        };
        const { data } = await axios({
            url: BASE_URL,
            method: 'POST',
            data: JSON.stringify(whatsappBody),
            headers: getHeader()

        })
        console.log(data)
    } catch (error) {
        console.log(error);
    }
};


const sendCancelByAdmin = async (mobile, payload) => {
    try {
        const { clientName, bookingId, pickupLocation, bookingType, dropLocation, pickupDate, pickupTime, cancellationReason } = payload

        const whatsappBody = {
            integrated_number: WHATSAPP_NUMBER,
            content_type: "template",
            "payload": {
                messaging_product: "whatsapp",
                type: "template",
                template: {
                    name: "booking_cancellation_by_admin",
                    language: {
                        "code": "en_GB",
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
                                    "value": clientName
                                },
                                "body_2": {
                                    "type": "text",
                                    "value": cancellationReason
                                },
                                "body_3": {
                                    "type": "text",
                                    "value": bookingId
                                },
                                "body_4": {
                                    "type": "text",
                                    "value": bookingType,
                                },
                                "body_5": {
                                    "type": "text",
                                    "value": pickupLocation,
                                },
                                "body_6": {
                                    "type": "text",
                                    "value": dropLocation,
                                },
                                "body_7": {
                                    "type": "text",
                                    "value": `${pickupDate} ${pickupTime}`,
                                },
                                "body_8": {
                                    "type": "text",
                                    "value": contact,
                                },
                                "body_9": {
                                    "type": "text",
                                    "value": website,
                                },
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


const sendCancelByPassenger = async (mobile, payload) => {
    try {
        const { clientName, bookingId, pickupLocation, bookingType, dropLocation, pickupDate, pickupTime, vehicleType } = payload

        const whatsappBody = {
            integrated_number: WHATSAPP_NUMBER,
            content_type: "template",
            "payload": {
                messaging_product: "whatsapp",
                type: "template",
                template: {
                    name: "booking_cancellation_by_passenger",
                    language: {
                        "code": "en_GB",
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
                                    "value": clientName
                                },
                                "body_2": {
                                    "type": "text",
                                    "value": bookingId
                                },
                                "body_3": {
                                    "type": "text",
                                    "value": pickupLocation,
                                },
                                "body_4": {
                                    "type": "text",
                                    "value": dropLocation,
                                },
                                "body_5": {
                                    "type": "text",
                                    "value": `${pickupDate} ${pickupTime}`,
                                },
                                "body_6": {
                                    "type": "text",
                                    "value": contact,
                                },
                                "body_7": {
                                    "type": "text",
                                    "value": website,
                                },
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
const sendRescheduledToPassenger = async (mobile, payload) => {
    try {
        const { clientName, bookingId, pickupLocation, bookingType, dropLocation, pickupDate, pickupTime, vehicleType } = payload
        const whatsappBody = {
            integrated_number: WHATSAPP_NUMBER,
            content_type: "template",
            "payload": {
                messaging_product: "whatsapp",
                type: "template",
                template: {
                    name: "booking_cancellation_by_passenger",
                    language: {
                        "code": "en_GB",
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
                                    "value": clientName
                                },
                                "body_2": {
                                    "type": "text",
                                    "value": bookingId
                                },
                                "body_3": {
                                    "type": "text",
                                    "value": bookingType
                                },
                                "body_4": {
                                    "type": "text",
                                    "value": pickupLocation,
                                },
                                "body_5": {
                                    "type": "text",
                                    "value": dropLocation,
                                },
                                "body_6": {
                                    "type": "text",
                                    "value": `${pickupDate} ${pickupTime}`,
                                },
                                "body_7": {
                                    "type": "text",
                                    "value": vehicleType,
                                },
                                "body_8": {
                                    "type": "text",
                                    "value": contact,
                                },
                                "body_9": {
                                    "type": "text",
                                    "value": website,
                                },
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
    } catch (error) {
        console.log(error)
    }

}
module.exports = {
    sendOtpWhatsapp,
    sendBookingConfirmWhatsapp,
    sendDriverAllotedWhatsapp,
    sendCancelByAdmin,
    sendCancelByPassenger,
    sendRescheduledToPassenger,
};
