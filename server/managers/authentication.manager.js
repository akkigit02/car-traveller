const UserModel = require("../models/user.model");
const {
  comparePassword,
  generateSecureRandomString,
  generateOTP,
} = require("../utils/common.utils");
const { JWT_SECRET_KEY } = process.env;
const JWT = require("jsonwebtoken");

const { saveBooking } = require("./client.manager");

const getUserSession = async (userId) => {
  const loginSessionId = generateSecureRandomString(10);
  const token = JWT.sign({ sessionId: loginSessionId }, JWT_SECRET_KEY, { expiresIn: "24h", });

  const user = await UserModel.findOne({ _id: userId }, {
    name: 1, email: 1, primaryPhone: 1, modules: 1,
  }).lean();
  await UserModel.updateOne({ _id: userId }, {
    $set: {
      "authentication.loginSessionId": loginSessionId,
    },
  });
  return { ...user, jwtToken: token, };
};

const login = async (req, res) => {
  try {
    const { body } = req;
    const { userName, password, userType, phoneNumber } = body;

    if (userType === 'CLIENT' && !phoneNumber)
      return res.status(400).send({ message: "Phone Number are required." });
    else if (userType === 'ADMIN' && (!userName || !password))
      return res.status(400).send({ message: "Username and password are required." });

    const query = userType === 'CLIENT' ? { primaryPhone: String(phoneNumber) } : {
      $or: [
        { email: String(body.userName) },
        { primaryPhone: String(body.userName) },
      ],
    }
    const user = await UserModel.findOne(query, { password: 1, status: 1, authentication: 1, email: 1, primaryPhone: 1, modules: 1, });
    if (!user) {
      return res.status(401).send({ message: userType === 'CLIENT' ? "Incorrect phone Number" : "Incorrect username or password. Please try again." });
    }
    if (userType !== 'CLIENT') {
      const isPassMatch = await comparePassword(password, user.password);
      if (!isPassMatch)
        return res.status(401).send({ message: "Incorrect username or password. Please try again." });
    }
    if (user.status === "sent") {
      return res.status(403).send({ message: "Please verify your account via OTP.", status: "UNVERIFIED", });
    }
    if (user?.authentication?.twoFactor?.enabled) {
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
      return res.status(200).send({ session: { sessionId, email: user.email, phone: user.primaryPhone }, status: "TWO_STEP_AUTHENTICATION", message: 'Otp Send Succcessfully' });
    }
    const userSession = await getUserSession(user._id);
    res.status(200).send({ message: "Login successful.", session: userSession, status: "LOGIN_SUCCESS", });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Something went wrong. Please try again later." });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { body } = req;
    const { otp, sessionId } = body;
    if (!otp || !sessionId) {
      return res.status(400).send({ message: "OTP and session ID are required." });
    }
    const user = await UserModel.findOne({ "authentication.twoFactor.sessionId": String(sessionId) }, { status: 1, authentication: 1, email: 1, primaryPhone: 1 });
    if (!user) {
      return res.status(401).send({ message: "Session expired or invalid. Please resend OTP and try again.", });
    }
    if (new Date() > user?.authentication?.twoFactor?.expiresOn)
      return res.status(401).send({ message: "Session expired. Please resend OTP and try again." });
    if (user?.authentication?.twoFactor?.otp !== String(otp))
      return res.status(401).send({ message: "Invalid OTP. Please try again." });
    await UserModel.updateOne({ _id: user._id }, {
      $unset: {
        "authentication.twoFactor.otp": 1,
        "authentication.twoFactor.expiresOn": 1,
        "authentication.twoFactor.sessionId": 1,
      },
    });
    const userSession = await getUserSession(user._id);
    res.status(200).send({ message: "Login successful.", session: userSession, status: "LOGIN_SUCCESS", });
  } catch (error) {
    res.status(500).send({ message: "Something went wrong. Please try again later." });
  }
};


const verifySession = async (req, res) => {
  try {
    const { query } = req;
    if (!query?.token)
      return res.status(401).send({ message: "Session expired or invalid. Please login again" });
    try {
      JWT.verify(query?.token, JWT_SECRET_KEY);
    } catch (error) {
      return res.status(401).send({ message: "Session expired or invalid. Please login again" });
    }
    const token = JWT.decode(query.token);
    if (!token?.sessionId)
      return res.status(401).send({ message: "Session expired or invalid. Please login again" });
    const user = await UserModel.findOne({ "authentication.loginSessionId": String(token?.sessionId) }, { status: 1, authentication: 1, email: 1, primaryPhone: 1, name: 1 });
    if (!user)
      return res.status(401).send({ message: "Session expired or invalid. Please login again" });
    const userSession = await getUserSession(user._id);
    return res.status(200).send({
      message: "Login successful.",
      session: userSession,
      status: "LOGIN_SUCCESS",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong. Please try again later." });
  }
};

const signup = async (req, res) => {
  try {
    const { body } = req;
    if (!body.userDetails.phoneNumber)
      return res.status(500).send({ message: "Phone Number is required" });
    if (!body.userDetails.email)
      return res.status(500).send({ message: "Email is required" });
    let user = await UserModel.findOne(
      { primaryPhone: String(body.userDetails.phoneNumber) },
      { modules: 1 }
    );
    if (user && user.modules.userType !== "CLIENT")
      return res.status(500).send({ message: "Phone Number already exist." });
    else {
      user = await UserModel.create({
        name: body.userDetails.name,
        email: body.userDetails.email,
        primaryPhone: body.userDetails.phoneNumber,
        modules: {
          userType: "CLIENT",
        },
      });
    }
    const otp = generateOTP();
    console.log(otp)
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
    const ride = await saveBooking({ body, user })
    res.status(200).send({ sessionId: sessionId, booking_id: ride?.rideId, status: "TWO_STEP_AUTHENTICATION", });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong. Please try again later." });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Email is required." });
    }

    const user = await UserModel.findOne(
      { email: String(email) },
      { "authentication.forgetOtp": 1 }
    );
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const otp = generateOTP();
    const resetSessionId = generateSecureRandomString();
    await UserModel.updateOne(
      { _id: user._id },
      {
        $set: {
          "authentication.forgetOtp.otp": otp,
          "authentication.forgetOtp.type": "email",
          "authentication.forgetOtp.expiresOn": new Date(
            new Date().getTime() + 300000
          ), // 5 minutes
          "authentication.forgetOtp.resetSessionId": resetSessionId,
        },
      }
    );
    console.log("OTP:", otp);
    // Send OTP to the user's email
    // sendEmail(user.email, `Your OTP is ${otp}`);

    res
      .status(200)
      .send({
        message: "OTP sent to email.",
        sessionId: resetSessionId,
        status: "OTP_SENT",
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Something went wrong. Please try again later." });
  }
};

const verifyPasswordResetOtp = async (req, res) => {
  try {
    const { otp, sessionId } = req.body;
    if (!otp || !sessionId) {
      return res.status(400).send({ message: "OTP and session ID are required." });
    }

    const user = await UserModel.findOne({ "authentication.forgetOtp.resetSessionId": String(sessionId) },
      { "authentication.forgetOtp": 1 }
    );
    if (!user) {
      return res
        .status(401)
        .send({
          message:
            "Session expired or invalid. Please resend OTP and try again.",
        });
    }

    if (new Date() > user.authentication.forgetOtp.expiresOn) {
      return res
        .status(401)
        .send({ message: "OTP expired. Please resend OTP and try again." });
    }

    if (user.authentication.forgetOtp.otp !== String(otp)) {
      return res
        .status(401)
        .send({ message: "Invalid OTP. Please try again." });
    }

    // OTP is verified; proceed to allow password reset
    res.status(200).send({ message: "OTP verified.", status: "OTP_VERIFIED" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Something went wrong. Please try again later." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { sessionId, newPassword } = req.body;
    if (!sessionId || !newPassword) {
      return res
        .status(400)
        .send({ message: "Session ID and new password are required." });
    }

    const user = await UserModel.findOne(
      { "authentication.forgetOtp.resetSessionId": String(sessionId) },
      { authentication: 1 }
    );
    if (!user) {
      return res
        .status(401)
        .send({
          message:
            "Session expired or invalid. Please resend OTP and try again.",
        });
    }

    const hashedPassword = await newPassword; // Assuming you have a function to hash passwords
    await UserModel.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: {
          "authentication.forgetOtp": 1, // Remove the password reset data
        },
      }
    );

    res
      .status(200)
      .send({
        message: "Password reset successful.",
        status: "PASSWORD_RESET_SUCCESS",
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Something went wrong. Please try again later." });
  }
};

const changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res
        .status(400)
        .send({
          message: "User ID, current password, and new password are required.",
        });
    }

    const user = await UserModel.findOne({ _id: userId }, { password: 1 });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const isCurrentPasswordMatch = await comparePassword(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordMatch) {
      return res
        .status(401)
        .send({ message: "Current password is incorrect." });
    }

    const hashedNewPassword = await hashPassword(newPassword);
    await UserModel.updateOne(
      { _id: userId },
      { $set: { password: hashedNewPassword } }
    );

    res
      .status(200)
      .send({
        message: "Password changed successfully.",
        status: "PASSWORD_CHANGE_SUCCESS",
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Something went wrong. Please try again later." });
  }
};

module.exports = {
  login,
  verifyOtp,
  verifySession,
  signup,
  forgotPassword,
  verifyPasswordResetOtp,
  resetPassword,
  changePassword,
};
