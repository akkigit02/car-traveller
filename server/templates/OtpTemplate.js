const template = ({ fullName, otp }) => {
    return `
      <div class="content">
        <p>Hey ${fullName},</p>
        <p>Thank you for signing up for our service. To complete your registration, please use the following one-time password (OTP):</p>
        <div class="otp-code">${otp}</div>
        <p>Please enter this verification code within the next 10 minutes for confirmation of your email address and to activate your account.</p>
        <p>If you did not request this verification, please ignore this email.</p>
     
  `;
};

module.exports = template;
