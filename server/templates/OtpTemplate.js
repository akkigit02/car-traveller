const template = ({ fullName, otp }) => {
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
        background-color: #2F3EA0;
        color: #fff;
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        padding: 10px;
        margin: 20px 0;
        border-radius: 4px;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #777;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to DDDCabs!</h1>
      </div>
      <div class="content">
        <p>Hey ${fullName},</p>
        <p>Thank you for signing up for our service. To complete your registration, please use the following one-time password (OTP):</p>
        <div class="otp-code">${otp}</div>
        <p>Please enter this verification code within the next 10 minutes for confirmation of your email address and to activate your account.</p>
        <p>If you did not request this verification, please ignore this email.</p>
      </div>
      <div class="footer">
        Best regards,<br />
        Team DDDCabs
      </div>
    </div>
  </body>
  </html>
  `;
  };
  
  module.exports = template;
  