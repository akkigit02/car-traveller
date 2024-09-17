const { Client, LocalAuth } = require('whatsapp-web.js');
const QRCode = require('qrcode');
const fs = require('fs')
global.delay = 30000;
global.queue = [];
global.isProcessing = false;

const sendMessage = async (payload) => {
    try {
        return new Promise((resolve, reject) => {
            global.queue.push({ payload, resolve, reject });
            processQueue();
        });
    } catch (error) {
        console.log(error)
    }
}


const processQueue = async () => {
    if (global.isProcessing || global.queue.length === 0) return;

    global.isProcessing = true;
    const { payload, resolve, reject } = global.queue.shift();

    try {
        const { to, message } = payload;
        if (global.whatsappClient)
            await global.whatsappClient.sendMessage(to + '@c.us', message);  // Corrected to use whatsappClient to send message
        resolve();
    } catch (error) {
        reject(error);
    }

    setTimeout(() => {
        global.isProcessing = false;
        processQueue();
    }, global.delay);
}


// const saveQrCode = async (data, fileName) => {
//     if (fs.existsSync(fileName))
//         fs.unlinkSync(fileName)
//     await QRCode.toFile(fileName, data);
// }


const initialize = () => {
    try {
        const client = new Client({
            authStrategy: new LocalAuth({ dataPath: 'whatsapp' }), puppeteer: {
                headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions']
            }
        });
        let authTimeout
        client.once('ready', () => {
            console.log('Client is ready!');
            global.whatsappClient = client;
            clearTimeout(authTimeout);
        });

        // client.on('qr', (qr) => {
        //     console.log(qr)
        //     saveQrCode(qr, 'whatsapp/qr/whatsappQr.png')
        // });
        authTimeout = setTimeout(() => {
            console.error('Authentication timed out. Destroying client.');
            client.destroy();
        }, 60000); // 1 minute timeout for authentication

        client.initialize();

    } catch (error) {
        console.log(error)
    }
}
const axios = require('axios');


const { WHATSAPP_API_TOKEN, WHATSAPP_NUMBER } = process.env;
const sendWhatsappMessage = async ({ to, message }) => {
    try {
        const WHATSAPP_API_URL = 'https://control.msg91.com/api/v5/whatsapp/whatsapp-outbound-message';
        const AUTH_TOKEN = WHATSAPP_API_TOKEN;
        const payload = {
            integrated_number: WHATSAPP_NUMBER,
            recipient_number: to,
            content_type: 'text',
            text: message
        };
        console.log(payload, AUTH_TOKEN)
        const response = await axios({
            url: WHATSAPP_API_URL,
            method: 'POST',
            data: payload,
            headers: {
                'Authkey': AUTH_TOKEN,
                'accept': 'application/json',
                'content-type': 'application/json'
            },
        })
        console.log('Message sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
    }
}
// saveQrCode('qr', 'whatsapp/qr/whatsappQr.png')
module.exports = {
    sendMessage,
    initialize,
    sendWhatsappMessage
}