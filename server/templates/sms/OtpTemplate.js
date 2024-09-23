const template = ({ fullName, otp }) => {
    return `
Your DDDcabs account verification code is ${otp}. 
This code will expire in 5 minutes. Please do not share this code with anyone. 

Thank you for choosing DDDCabs.
`
}
module.exports = template