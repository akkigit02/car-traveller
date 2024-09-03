const fileName = 'server/managers/common.manager.js'
const ObjectId = require('mongoose').Types.ObjectId
const UserModel = require("../models/user.model");

const getUserProfile = async (req, res) => {
  try {
    const { user } = req
    const userDetails = await UserModel.findOne({ _id: user._id }, {
      name: 1,
      email: 1,
      primaryPhone: 1,
      secondaryPhone: 1,
      dateOfBirth: 1,
      currentAddress: 1,
      twoFactorEnable: '$authentication.twoFactor.enabled'
    });
    return res.status(200).send({ userDetails });
  } catch (error) {
    logger.log(`${fileName} -> getUserProfile`, { error: error })
    res.status(500).send({ message: 'Server Error' })
  }
};

module.exports = {
  getUserProfile,
};
