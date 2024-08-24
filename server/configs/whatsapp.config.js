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
            saveQrCode(qr, 'whatsapp/qr/whatsappQr.png')
        });
        authTimeout = setTimeout(() => {
            console.error('Authentication timed out. Destroying client.');
            client.destroy();
        }, 60000); // 1 minute timeout for authentication

        client.initialize();

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    sendMessage,
    initialize
}