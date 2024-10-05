const { MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD, NODE_ENV } = process.env
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
    getEmailBodyBing = (body) => {
        return `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }

                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                    .logo{
                  text-align: center;
                }

                .header {
                    text-align: center;
                    background-color: #2F3EA0;
                    color: #fff;
                    padding: 20px;
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                }

                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }

                .content {
                    padding: 20px;
                }

                .content p {
                    line-height: 1.6;
                }

                .otp-code {

                    font-size: 24px;
                    font-weight: bold;
                }

                .footer {
                    text-align: left;
                    font-size: 12px;
                    color: #777;
                    padding: 20px;
                }
                    .footer-1{
                     text-align: center;
                    background-color:#b0cfff;
                    color: #fff;
                    padding: 10px;
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                    margin-top:10px;
                }
            </style>
        </head>

        <body>
        <div class="container">
        <div class="logo"> <img width="150"  src="https://app.dddcabs.com/static/media/logomain.9f3d4e7d928bc68e59fb.png"/></div>
      <div class="header">
        <h1>Welcome to DDDCabs!</h1>
      </div>
      <div class="content">
            ${body}
           </div>
      <div class="footer">
        Best regards,<br />
        Team DDDCabs
      </div>
      <div class="footer-1">
       <p style="margin-bottom: 5px;">&copy; 2024 ddd cabs</p>
      </div>
    </div>
  </body>
  </html>
        `
    }
    async sendMail({ to, subject, html, attachments, cc, bcc }) {
        try {
            const bindHtml=this.getEmailBodyBing(html)
            await this.connection.sendMail({ from: this.senderMail, to, subject, html:bindHtml, cc, bcc, attachments })
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