const bcrypt = require('bcrypt');



const comparePassword = function (first, second) {
    return bcrypt.compare(first, second)
}
const encryptPassword = async function (password, rounds = 10) {
    return await bcrypt.hash(password, await bcrypt.genSalt(rounds));
}
module.exports = {
    comparePassword,
    encryptPassword
}