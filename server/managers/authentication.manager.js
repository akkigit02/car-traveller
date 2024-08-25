const UserModel = require("../models/user.model");
const {
  comparePassword,
  generateSecureRandomString,
  generateOTP,
} = require("../utils/common.utils");
const { JWT_SECRET_KEY } = process.env;
const JWT = require("jsonwebtoken");
const RideModel = require("../models/ride.model");
const PricingModel = require("../models/pricing.model");
const {
  dateDifference,
  estimateRouteDistance,
} = require("../utils/calculation.util");
const CitiesModel = require("../models/cities.model");
const { getDistanceBetweenPlaces } = require("../services/GooglePlaces.service");

const getUserSession = async (userId) => {
  const loginSessionId = generateSecureRandomString(10);
  const token = JWT.sign({ sessionId: loginSessionId }, JWT_SECRET_KEY, {
    expiresIn: "24h",
  });

  const user = await UserModel.findOne(
    { _id: userId },
    {
      firstName: 1,
      lastName: 1,
      email: 1,
      primaryPhone: 1,
      modules: 1,
    }
  ).lean();
  await UserModel.updateOne(
    { _id: userId },
    {
      $set: {
        "authentication.loginSessionId": loginSessionId,
      },
    }
  );
  return {
    ...user,
    jwtToken: token,
  };
};

const login = async (req, res) => {
  try {
    const { body } = req;
    const { userName, password } = body;
    if (!userName || !password) {
      return res
        .status(400)
        .send({ message: "Email and password are required." });
    }
    const user = await UserModel.findOne(
      {
        $or: [
          { email: String(body.userName) },
          { primaryPhone: String(body.userName) },
        ],
      },
      {
        password: 1,
        status: 1,
        authentication: 1,
        email: 1,
        primaryPhone: 1,
        modules: 1,
      }
    );
    if (!user) {
      return res
        .status(401)
        .send({ message: "Incorrect username or password. Please try again." });
    }
    const isPassMatch = await comparePassword(password, user.password);
    if (!isPassMatch)
      return res
        .status(401)
        .send({ message: "Incorrect username or password. Please try again." });
    if (user.status === "sent") {
      return res
        .status(403)
        .send({
          message: "Please verify your account via OTP.",
          status: "UNVERIFIED",
        });
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
      return res
        .status(200)
        .send({
          session: { sessionId, email: user.email, phone: user.primaryPhone },
          status: "TWO_STEP_AUTHENTICATION",
        });
    }
    const userSession = await getUserSession(user._id);
    res
      .status(200)
      .send({
        message: "Login successful.",
        session: userSession,
        status: "LOGIN_SUCCESS",
      });
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
      return res
        .status(400)
        .send({ message: "OTP and session ID are required." });
    }
    const user = await UserModel.findOne(
      { "authentication.twoFactor.sessionId": String(sessionId) },
      { status: 1, authentication: 1, email: 1, primaryPhone: 1 }
    );
    if (!user) {
      return res
        .status(401)
        .send({
          message:
            "Session expired or invalid. Please resend OTP and try again.",
        });
    }
    console.log(new Date(), user?.authentication?.twoFactor?.expiresOn);
    if (new Date() > user?.authentication?.twoFactor?.expiresOn)
      return res
        .status(401)
        .send({ message: "Session expired. Please resend OTP and try again." });
    if (user?.authentication?.twoFactor?.otp !== String(otp))
      return res
        .status(401)
        .send({ message: "Invalid OTP. Please try again." });
    await UserModel.updateOne(
      { _id: user._id },
      {
        $unset: {
          "authentication.twoFactor.otp": 1,
          "authentication.twoFactor.expiresOn": 1,
          "authentication.twoFactor.sessionId": 1,
        },
      }
    );
    const userSession = await getUserSession(user._id);
    res
      .status(200)
      .send({
        message: "Login successful.",
        session: userSession,
        status: "LOGIN_SUCCESS",
      });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Something went wrong. Please try again later." });
  }
};

const verifySession = async (req, res) => {
  try {
    const { query } = req;
    if (!query?.token)
      return res
        .status(401)
        .send({ message: "Session expired or invalid. Please login again" });
    try {
      JWT.verify(query?.token, JWT_SECRET_KEY);
    } catch (error) {
      return res
        .status(401)
        .send({ message: "Session expired or invalid. Please login again" });
    }
    const token = JWT.decode(query.token);
    if (!token?.sessionId)
      return res
        .status(401)
        .send({ message: "Session expired or invalid. Please login again" });
    const user = await UserModel.findOne(
      { "authentication.loginSessionId": String(token?.sessionId) },
      { status: 1, authentication: 1, email: 1, primaryPhone: 1 }
    );
    console.log(113, user);
    if (!user)
      return res
        .status(401)
        .send({ message: "Session expired or invalid. Please login again" });
    const userSession = await getUserSession(user._id);
    return res
      .status(200)
      .send({
        message: "Login successful.",
        session: userSession,
        status: "LOGIN_SUCCESS",
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Something went wrong. Please try again later." });
  }
};

const signup = async (req, res) => {
  try {
    const { body } = req;
    console.log(body.bookingDetails.to);
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
        firstName: body.userDetails.firstName,
        lastName: body.userDetails.lastName,
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
    const isCityCab = body?.bookingDetails?.tripType === 'cityCab'
    const bookingData = {
      vehicleId: body.bookingDetails?.vehicleId,
      passengerId: user._id,
      pickupDate: {
        date: new Date(body?.bookingDetails?.pickUpDate).getDate(),
        month: new Date(body?.bookingDetails?.pickUpDate).getMonth(),
        year: new Date(body.bookingDetails?.pickUpDate).getFullYear(),
      },
      pickupTime: body.bookingDetails?.pickUpTime,
      trip: {
        tripType: body?.bookingDetails?.tripType,
        hourlyType: body?.bookingDetails?.hourlyType
      },
      bokkingStatus: "pending",
    };

    if (isCityCab) {
      bookingData['pickupLocation'] = body?.bookingDetails?.from?.name
      bookingData['dropoffLocation'] = body?.bookingDetails?.to[0]?.name
    } else {
      bookingData['pickupCity'] = body?.bookingDetails?.from?._id
      bookingData['dropCity'] = body?.bookingDetails?.to?.map(ele => ele._id)
      bookingData['pickupLocation'] = body?.userDetails?.pickupAddress
      bookingData['dropoffLocation'] = body?.userDetails?.dropAddress
    }
    if (body?.bookingDetails?.dropDate) {
      bookingData['dropDate'] = {
        date: new Date(body?.dropDate).getDate(),
        month: new Date(body?.dropDate).getMonth(),
        year: new Date(body?.dropDate).getFullYear(),
      }
    }
    const ride = await RideModel.create(bookingData);
    res.status(200).send({ sessionId: sessionId, bokking_id: ride._id, status: "TWO_STEP_AUTHENTICATION", });
    if (ride._id) {
      const price = await getTotalPrice(body?.bookingDetails);
      await RideModel.updateOne({ _id: ride._id }, {
        $set: {
          totalPrice: price?.totalPrice,
          totalDistance: parseFloat(price?.distance)
        }
      });
      // send notification to admin
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong. Please try again later." });
  }
};

const getTotalPrice = async (bookingDetails) => {
  try {
    let totalPrice = 0;
    let distance = 0;
    let toDetail = [];
    let fromDetail = "";
    const car = await PricingModel.findOne({
      _id: bookingDetails?.vehicleId,
    }).lean();
    if (bookingDetails?.tripType === "oneWay") {
      let toCity = await CitiesModel.findOne({ _id: bookingDetails.to }).lean();
      fromDetail = await CitiesModel.findOne({ _id: bookingDetails.from }).lean();
      distance = estimateRouteDistance(
        fromDetail.latitude,
        fromDetail.longitude,
        toCity.latitude,
        toCity.longitude,
        1.25
      );
      toDetail.push(toCity);
      totalPrice = distance?.toFixed(2) * car.costPerKm + (car?.driverAllowance ? car.driverAllowance : 0);
    } else if (bookingDetails?.tripType === "roundTrip") {
      let cityIds = bookingDetails?.to?.map((vehicle) => vehicle._id);
      cityIds.unshift(bookingDetails?.from?._id);
      let totalDistance = 0;
      for (let i = 0; i < cityIds.length - 1; i++) {
        const fromCity = await CitiesModel.findOne({ _id: cityIds[i] }).lean();
        if (i == 0) {
          fromDetail = fromCity;
        }
        const toCity = await CitiesModel.findOne({
          _id: cityIds[i + 1],
        }).lean();
        // if(i+1 < cityIds.length - 1)
        toDetail.push(toCity);
        const dist = estimateRouteDistance(
          fromCity.latitude,
          fromCity.longitude,
          toCity.latitude,
          toCity.longitude,
          1.25
        );

        totalDistance += dist;
      }
      distance = totalDistance;
      let numberOfDay = dateDifference(
        bookingDetails?.pickUpDate,
        bookingDetails?.returnDate
      );
      if (numberOfDay == 0) numberOfDay = 1;

      if (distance <= numberOfDay * 300) {
        totalPrice =
          numberOfDay * 300 * car.costPerKm + numberOfDay * car.driverAllowance;
      } else {
        totalPrice =
          distance * car.costPerKm + numberOfDay * car.driverAllowance || 0;
      }
    } else if (bookingDetails?.tripType === "hourly") {
      fromDetail = await CitiesModel.findOne({ _id: bookingDetails.from }).lean();
      let hourlyData = car.hourly.find(hr => hr.type === bookingDetails.hourlyType)
      if (hourlyData) {
        totalPrice = hourlyData.basePrice + car.driverAllowance || 0;
        distance = hourlyData?.distance
      }
    } else if (bookingDetails?.tripType === 'cityCab') {
      const data = await getDistanceBetweenPlaces(bookingDetails?.pickupCityCab, bookingDetails?.dropCityCab)
      distance = parseFloat(data?.distance.replace(/[^0-9.]/g, ''))
      fromDetail = { name: data.from }
      toDetail = [{ name: data.to }]
      if (distance < 10) {
        totalPrice = car.minimumFare
      } else if (distance > 10) {
        const tempDistance = distance - 10;
        totalPrice = tempDistance?.toFixed(2) * car.costPerKm + car.minimumFare
      }
    }

    return { totalPrice, toDetail, distance: distance?.toFixed(2) };
  } catch (error) {
    console.log(error)
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
      return res
        .status(400)
        .send({ message: "OTP and session ID are required." });
    }

    const user = await UserModel.findOne(
      { "authentication.forgetOtp.resetSessionId": String(sessionId) },
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
