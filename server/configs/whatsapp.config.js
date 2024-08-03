const { Client, LocalAuth } = require('whatsapp-web.js');
const QRCode = require('qrcode');
const fs = require('fs')
class Whatsapp {
    constructor(delay) {
        this.delay = delay;
        this.queue = [];
        this.isProcessing = false;
        this.whatsappClient = new Client({ authStrategy: new LocalAuth({ dataPath: 'whatsapp' }) });

        this.authTimeout = null


        this.whatsappClient.on('ready', () => {
            console.log('whatsappClient is ready!');
            clearTimeout(this.authTimeout);
        });

        this.whatsappClient.on('qr', async (qr) => {
            await this.saveQrCode(qr, 'whatsapp/qr/hello.png');
        });

        this.whatsappClient.initialize();
    }

    initialize() {
        this.authTimeout = setTimeout(() => {
            console.error('Authentication timed out. Destroying client.');
            this.whatsappClient.destroy();
        }, 60000); // 1 minute timeout for authentication

        this.whatsappClient.initialize();
    }



    async saveQrCode(data, fileName) {
        if (fs.existsSync(fileName))
            fs.unlinkSync(fileName)
        await QRCode.toFile(fileName, data);
    }

    async sendMessage(payload) {
        return new Promise((resolve, reject) => {
            this.queue.push({ payload, resolve, reject });
            this.processQueue();
        });
    }

    async processQueue() {
        if (this.isProcessing || this.queue.length === 0) return;

        this.isProcessing = true;
        const { payload, resolve, reject } = this.queue.shift();

        try {
            const { to, message } = payload;
            await this.whatsappClient.sendMessage(to, message);  // Corrected to use whatsappClient to send message
            resolve();
        } catch (error) {
            reject(error);
        }

        setTimeout(() => {
            this.isProcessing = false;
            this.processQueue();
        }, this.delay);
    }
}
const whatsapp = new Whatsapp(2000);
whatsapp.initialize();
global.whtasppClient = whatsapp

