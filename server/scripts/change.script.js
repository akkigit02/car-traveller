require('dotenv').config();
require('../configs/database.config');
const UserModel = require('../models/user.model');
const { encryptPassword } = require('../utils/common.utils');
(async () => {
    const password = "DDDCABS@2024#";
    const encryptPasswordString = await encryptPassword(password)
    await UserModel.updateOne({ email: 'panditup571@gmail.com' }, { $set: { primaryPhone: '8290109580', email: 'guptarajan778@gmail.com', password: encryptPasswordString, email: 'rajangupta@gmail.com' } })
})()