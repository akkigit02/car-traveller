
const axios = require('axios');
const { GRAPH_API_TOKEN } = process.env;
const sendTextMessage = async ({ to, body }) => {
    try {
        const FB_API_URL = 'https://graph.facebook.com/v20.0/381529865041952/messages';
        const AUTH_TOKEN = GRAPH_API_TOKEN;
        const payload = {
            messaging_product: 'whatsapp',
            to: to,
            type: 'text',
            text: {
                body: body || ' '
            },
        };
        const response = await axios({
            url: FB_API_URL,
            method: 'POST',
            data: JSON.stringify(payload),
            headers: {
                'Authorization': `Bearer ${AUTH_TOKEN}`,
                'Content-Type': 'application/json',
            },
        })
        console.log('Message sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
    }
}