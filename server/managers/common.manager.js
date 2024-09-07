const fileName = 'server/managers/common.manager.js'
const ObjectId = require('mongoose').Types.ObjectId
const UserModel = require("../models/user.model");
const { generateOTP, generateSecureRandomString } = require('../utils/common.utils');
const { verifyOtp } = require('./authentication.manager');

const getProfile = async (req, res) => {
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

const sendOtp = async (req, res) => {
  try {
    const { user } = req
    const otp = generateOTP();
    const sessionId = generateSecureRandomString();
    await UserModel.updateOne(
      { _id: user._id },
      {
        $set: {
          "authentication.twoFactor.otp": otp,
          "authentication.twoFactor.expiresOn": new Date(
            new Date().getTime() + 300000
          ),
          "authentication.twoFactor.sessionId": sessionId,
        },
      }
    );
    // send otp
    console.log(otp);
    return res.status(200).send({ sessionId, status: "TWO_STEP_AUTHENTICATION", message: 'Otp Send Succcessfully' });
  } catch (error) {
    logger.log(`${fileName} -> changePhoneNumber`, { error: error })
    res.status(500).send({ message: 'Server Error' })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { user, body } = req
    if(user.primaryPhone!==body.primaryPhone){
      const { otp, sessionId } = body.otpDetails;
      if (!otp || !sessionId) {
        return res.status(400).send({ message: "OTP and session ID are required." });
      }
      const userData = await UserModel.findOne({ _id: user._id, "authentication.twoFactor.sessionId": String(sessionId) }, { status: 1, authentication: 1, email: 1, primaryPhone: 1 });
      if (!userData) {
        return res.status(401).send({ message: "Session expired or invalid. Please resend OTP and try again.", });
      }
      if (new Date() > userData?.authentication?.twoFactor?.expiresOn)
        return res.status(401).send({ message: "Session expired. Please resend OTP and try again." });
      if (userData?.authentication?.twoFactor?.otp !== String(otp))
        return res.status(401).send({ message: "Invalid OTP. Please try again." });
    }
    await UserModel.updateOne({ _id: user._id }, {
      $set: {
        ...body,
        "authentication.twoFactor.enabled": body.twoFactorEnable,
      },
      $unset: {

        "authentication.twoFactor.otp": 1,
        "authentication.twoFactor.expiresOn": 1,
        "authentication.twoFactor.sessionId": 1,
      },
    });
    return res.status(200).send({ message: 'Profile Update Successfull' });
  } catch (error) {
    logger.log(`${fileName} -> getUserProfile`, { error: error })
    res.status(500).send({ message: 'Server Error' })
  }
};

module.exports = {
  getProfile,
  sendOtp,
  updateProfile
};
