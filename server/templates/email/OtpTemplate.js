const template = ({ fullName, otp }) => {
    return `
Hey ${fullName},

Thank you for signing up for our service. To complete your registration, please use the following one-time password
(OTP):

${otp}

Please enter this verification code within the next 10 minutes for confirmation of your email address and activate your
account.

If you did not request this verification, please ignore this email.

Best regards,

Team DDDCabs
`
}

module.exports = template