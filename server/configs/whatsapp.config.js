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


const saveQrCode = async (data, fileName) => {
    if (fs.existsSync(fileName))
        fs.unlinkSync(fileName)
    await QRCode.toFile(fileName, data);
}


const initialize = () => {
    try {
        const client = new Client({ authStrategy: new LocalAuth({ dataPath: 'whatsapp' }) });
        let authTimeout
        client.once('ready', () => {
            console.log('Client is ready!');
            global.whatsappClient = client;
            clearTimeout(authTimeout);
        });

        client.on('qr', (qr) => {
            console.log(qr)
            saveQrCode(qr, 'whatsapp/qr/whatsappQr.png')
        });
        authTimeout = setTimeout(() => {
            console.error('Authentication timed out. Destroying client.');
            client.destroy();
        }, 300000); // 1 minute timeout for authentication

        client.initialize();

    } catch (error) {
        console.log(error)
    }
}
const axios = require('axios');


const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN } = process.env;
const sendWhatsappMessage = async () => {
    try {
        const FB_API_URL = 'https://graph.facebook.com/v20.0/381529865041952/messages';
        const AUTH_TOKEN = GRAPH_API_TOKEN;
        const payload = {
            messaging_product: 'whatsapp',
            to: '919685495640',
            type: 'text',
            text: {
                body: "Heloo  How Are you"
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

module.exports = {
    sendMessage,
    initialize,
    sendWhatsappMessage
}