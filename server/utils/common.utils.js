const bcrypt = require('bcrypt');
const crypto = require('crypto');


const comparePassword = function (first, second) {
    return bcrypt.compare(first, second)
}
const encryptPassword = async function (password, rounds = 10) {
    return await bcrypt.hash(password, await bcrypt.genSalt(rounds));
}
const generateSecureRandomString = (length = 16) => {
    return crypto.randomBytes(length).toString('hex') + Date.now()
}
function generateOTP() {
    return Math.round(Math.random() * (999999 - 111111 + 1) + 111111);
};


module.exports = {
    comparePassword,
    encryptPassword,
    generateSecureRandomString,
    generateOTP
}