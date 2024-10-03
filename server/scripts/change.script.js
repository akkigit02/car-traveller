require('dotenv').config();
require('../configs/database.config');
const UserModel = require('../models/user.model');
const { encryptPassword } = require('../utils/common.utils');
(async () => {
    console.log("Script Start")
    const password = "Suraj@123#";
    const encryptPasswordString = await encryptPassword(password)
    console.log(encryptPasswordString)
    // await UserModel.updateOne({ email: 'panditup571@gmail.com' }, { $set: { primaryPhone: '8290109580', email: 'guptarajan778@gmail.com', password: encryptPasswordString } })
    console.log("Script End")
    process.exit(0)
})()