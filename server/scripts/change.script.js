require('dotenv').config();
require('../configs/database.config');
const UserModel = require('../models/user.model');
const { encryptPassword } = require('../utils/common.utils');
(async () => {
    console.log("Script Start")

    const textData = {
        "name": "test",
        "email": "test@mailinator.com",
        "primaryPhone": "1234567890",
        "status": "verified",
        "password": await encryptPassword("Test@123#"),
        "authentication": {
            twoFactor: {
                enabled: false
            }
        },
        "modules": {
            "userType": "CLIENT",
            "accessibleModule": []
        },
        "currentAddress": {
            "addressLine": "noida",
            "city": "noida",
            "state": "noida",
            "zip": "123456"
        },
        "permanentAddress": {
            "addressLine": "noida",
            "city": "noida",
            "state": "noida",
            "zip": "123456"
        },
        "logo": ""
    }
    await UserModel.create(textData)
    console.log("Script End")
    process.exit(0)
})()