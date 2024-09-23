const { MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD,NODE_ENV } = process.env
console.log(MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD)
const filePath = 'server/services/smtp.service.js'
const NodeMailer = require('nodemailer');
class SMTPService {

    constructor() {
        this.config = {
            host: MAIL_HOST,
            port: MAIL_PORT,
            secure: true,
            secureConnection: false,
            tls: {
                rejectUnauthorized: false
            },
            auth: {
                user: MAIL_USERNAME,
                pass: MAIL_PASSWORD,
            },
        };
        this.senderMail = MAIL_USERNAME;

        this.connection = NodeMailer.createTransport(this.config);
    }

    async sendMail({ to, subject, html, attachments, cc, bcc }) {
        try {
            await this.connection.sendMail({ from: this.senderMail, to, subject, html, cc, bcc, attachments })
            if (NODE_ENV === 'development') console.log("Email Send Successfully")
            return { success: true }
        } catch (error) {
            logger.log(`${filePath} -> sendSimpleMail`, {
                info: { to, subject, html, attachments, cc }, error
            });
            return { success: false }
        }
    }

}
module.exports = SMTPService