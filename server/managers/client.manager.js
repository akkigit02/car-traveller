const ObjectId = require('mongoose').Types.ObjectId
const CitiesModel = require("../models/cities.model");
const RideModel = require("../models/ride.model");
const PricingModel = require("../models/pricing.model");
const CouponModel = require("../models/coupon.model");
const UserModel = require("../models/user.model");
const BillingModel = require('../models/billing.model')
const EnquirePackageModel = require("../models/enquire.package.model")
const EnquireContactModel = require("../models/enquire.contact.model")
const PaymentModel = require('../models/payment.model');
const NewBokkingTemplate = require('../templates/NewBokking')
const NewLeadTemplate = require('../templates/NewLead')
const DuePaymentTemplate = require('../templates/DuePaymentRecived')
const BookingCancelTemplate = require('../templates/BookingCancel')
const BookingReshuduledTemplate = require('../templates/BookingReshuduled')
const NotificationModel = require('../models/notification.model')
const {
  estimateRouteDistance,
  dateDifference,
} = require("../utils/calculation.util");
const { getAutoSearchPlaces, getDistanceBetweenPlaces } = require("../services/GooglePlaces.service");
const { CITY_CAB_PRICE } = require('../constants/common.constants');
const { initiatePhonepePayment, chackStatusPhonepePayment } = require('../services/phonepe.service');
const { isSchedulabel, roundToDecimalPlaces } = require('../utils/format.util');
const { incrementBookingNumber, incrementInvoiceNumber, generateInvoiceHTML, getPdfFromHtml } = require('../services/common.service');
const { getTotalPrice } = require('../services/calculation.service');
const { sendBookingConfirmedSms, sendRideRescheduledSms, sendBookingCancelledByPassengerSms } = require('../services/sms.service');
const SMTPService = require('../services/smtp.service');
const { sendDriverAllotedWhatsapp, sendBookingConfirmWhatsapp, sendCancelByPassenger, sendRescheduledToPassenger } = require('../services/whatsapp.service');
const { bookigSchedule } = require('../services/schedule.service');
const { sendNotificationToClient, sendNotificationToAdmin } = require('../services/notification.service');

const getCities = async (req, res) => {
  try {
    const search = req?.query?.search;
    let match = { isMetroCity: true }
    if (search?.trim()) {
      match = { city_name: { $regex: search, $options: "i" } }
    }
    const cities = await CitiesModel.aggregate([
      {
        $addFields: { city_name: { $concat: ["$name", ", ", "$state_name"] } },
      },
      {
        $match: match,
      },
      { $limit: 15 },
    ]);
    return res.status(200).send({ cities });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};
const getAddressSuggestion = async (req, res) => {
  try {
    const { search, cityId } = req?.query;
    const city = await CitiesModel.findById(cityId)
    let address = await getAutoSearchPlaces(search, city?.name)
    address = address.map(ele => ele.description)
    return res.status(200).send({ address });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const getAddressSuggestionOnLandingPage = async (req, res) => {
  try {
    const { search, cityId } = req?.query;
    const city = await CitiesModel.findById(cityId)
    let address = await getAutoSearchPlaces(search, city?.name)
    address = address.map(ele => ({ address: ele.description, placeId: ele.place_id }))
    return res.status(200).send({ address });
  } catch (error) {
    logger.log('server/managers/client.manager.js-> getAddressSuggestionOnLandingPage', { error: error })
    res.status(500).send({ message: 'Server Error' })
  }
};

const getCars = async (req, res) => {
  try {
    let search = req?.query?.search;
    let cars = await PricingModel.find({}).lean();
    let distance = null;
    let toDetail = [];
    let fromDetail = "";
    let carList = [];
    let hourlyCarDetails = []
    if (['cityCab'].includes(search?.tripType)) {
      cars = cars.filter(vehicle => !['Traveller', 'Innova', 'Innova_Crysta'].includes(vehicle.vehicleType))
    } else {
      cars = cars.filter(vehicle => !['Hatchback'].includes(vehicle.vehicleType))
    }
    if (search?.tripType === "oneWay") {
      let toCity = await CitiesModel.findOne({ _id: search.to }).lean();
      fromDetail = await CitiesModel.findOne({ _id: search.from }).lean();
      distance = estimateRouteDistance(
        fromDetail.latitude,
        fromDetail.longitude,
        toCity.latitude,
        toCity.longitude,
        1.25
      );
      toDetail.push(toCity)

      let metroCityPrice = 1
      if (!toCity?.isMetroCity) metroCityPrice = 1.75

      for (let car of cars) {
        let extra = 1
        if (car.vehicleType === 'Traveller') {
          extra = 2
        }
        car["totalPrice"] =
          distance * car.costPerKmOneWay * metroCityPrice * extra + (car?.driverAllowance ? car.driverAllowance : 0);

        car['showDistance'] = distance?.toFixed(2);
        car['showPrice'] = car?.totalPrice
        car["totalPrice"] = car?.totalPrice - (car?.totalPrice * car?.discount) / 100
        car["discountAmount"] = (car?.totalPrice * car?.discount) / 100
        car['costPerKm'] = car.costPerKmOneWay
        carList.push(car);
      }
    } else if (search?.tripType === "roundTrip") {
      // Initialize an array to hold all "to" values
      let consolidatedToArray = [];

      // Loop through the object properties
      for (let key in search) {
        if (search.hasOwnProperty(key)) {
          // Check if the key is 'to' or matches the pattern of additional 'to' fields like '2To', '3To', etc.
          if (key === "to" || key.match(/^\d+To$/)) {
            consolidatedToArray.push(search[key]);
            delete search[key];
          }
        }
      }

      search.to = consolidatedToArray;
      let cityIds = consolidatedToArray;
      cityIds.unshift(search.from);
      cityIds.push(search.from);
      let totalDistance = 0;

      for (let i = 0; i < cityIds.length - 1; i++) {
        const fromCity = await CitiesModel.findOne({ _id: cityIds[i] }).lean();
        if (i == 0) {
          fromDetail = fromCity
        }
        const toCity = await CitiesModel.findOne({
          _id: cityIds[i + 1],
        }).lean();
        toDetail.push(toCity)
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
      let numberOfDay = dateDifference(search.pickUpDate, search.returnDate);
      for (let car of cars) {
        if (distance <= numberOfDay * 250) {
          car["totalPrice"] =
            numberOfDay * 300 * car.costPerKmRoundTrip +
            numberOfDay * car.driverAllowance;
          car['showDistance'] = numberOfDay * 250
        } else {
          car["totalPrice"] =
            distance * car.costPerKmRoundTrip + numberOfDay * car.driverAllowance || 0;

          car['showDistance'] = distance.toFixed(2)
        }
        car['showPrice'] = car?.totalPrice
        car["totalPrice"] = car?.totalPrice - (car?.totalPrice * car?.discount) / 100
        car["discountAmount"] = (car?.totalPrice * car?.discount) / 100
        car['costPerKm'] = car.costPerKmRoundTrip
        carList.push(car);
      }
    } else if (search?.tripType === "hourly") {
      fromDetail = await CitiesModel.findOne({ _id: search.from }).lean();
      for (let car of cars) {
        let hourlyData = car.hourly.find(hr => hr.type === search.hourlyType)
        if (hourlyData) {
          car["totalPrice"] = hourlyData.basePrice + car.driverAllowance || 0;
          car["hour"] = hourlyData.hour
          distance = hourlyData?.distance
          car['showDistance'] = distance?.toFixed(2);
          car['showPrice'] = car?.totalPrice
          car["totalPrice"] = car?.totalPrice - (car?.totalPrice * car?.discount) / 100
          car["discountAmount"] = (car?.totalPrice * car?.discount) / 100
          carList.push(car);
        }
        hourlyCarDetails = [...car.hourly, ...hourlyCarDetails]
      }

    } else if (search?.tripType === 'cityCab') {
      const data = await getDistanceBetweenPlaces(search?.pickupCityCab, search?.dropCityCab)
      distance = parseFloat(data?.distance.replace(/[^0-9.]/g, ''))
      const priceInfo = CITY_CAB_PRICE.find(info => info.max >= distance && info.min <= distance)
      fromDetail = { name: data.from }
      toDetail = [{ name: data.to }]
      for (let car of cars) {
        if (['Sedan'].includes(car.vehicleType)) {
          car["totalPrice"] = priceInfo.sedan.base + priceInfo.sedan.perKm * distance
        } else if (['Hatchback'].includes(car.vehicleType)) {
          car["totalPrice"] = priceInfo.hatchback.base + priceInfo.hatchback.perKm * distance
        } else {
          car["totalPrice"] = priceInfo.suv.base + priceInfo.suv.perKm * distance
        }
        car['showDistance'] = distance?.toFixed(2);
        car['showPrice'] = car?.totalPrice
        car["totalPrice"] = car?.totalPrice - (car?.totalPrice * car?.discount) / 100
        car["discountAmount"] = (car?.totalPrice * car?.discount) / 100
        carList.push(car);
      }
    }
    let hourlyDetails = []
    let hourlyTypes = []
    hourlyCarDetails.map(detail => {
      if (!hourlyTypes.includes(detail.type)) {
        delete detail?.basePrice
        hourlyDetails.push(detail)
      }
      hourlyTypes.push(detail.type)
    })

    const bookingDetails = {
      from: { name: fromDetail.name, _id: fromDetail._id, isMetroCity: fromDetail?.isMetroCity },
      to: toDetail.map(city => ({ name: city.name, _id: city._id })),
      distance: distance.toFixed(2),
      pickupCityCab: search?.pickupCityCab,
      dropCityCab: search?.dropCityCab,
      pickUpDate: search.pickUpDate,
      returnDate: search.returnDate,
      pickUpTime: search.pickUpTime,
      hourlyDetails: hourlyDetails,
    };
    return res.status(200).send({ cars: carList, bookingDetails });
  } catch (error) {
    logger.log('server/managers/client.manager.js-> getCars', { error: error })
    res.status(500).send({ message: 'Server Error' })
  }
};

const savePackage = async (req, res) => {
  try {
    const package = await EnquirePackageModel.create(req.body)
    res.status(201).send({
      message: `Enquiry Confirmed! 🎉 
  Thanks,${req.body.name}. We’ve received your package enquiry and will get back to you soon!
  - DDD CABS`, package
    })
  } catch (error) {
    logger.log('server/managers/admin.manager.js-> savePackage', { error: error })
    res.status(500).send({ message: 'Server Error' })
  }
}

const saveContact = async (req, res) => {
  try {
    req.body.date = new Date();
    await EnquireContactModel.create(req.body);
    res.status(201).send({
      message: `Enquiry Received! 🎉 
  Thanks, ${req.body.name}. We’ve received your enquiry and will get back to you soon!
  - DDD CABS`
    });
  } catch (error) {
    logger.log('server/managers/admin.manager.js-> saveContact', { error: error });
    res.status(500).send({ message: 'Server Error' });
  }
}



const updatePriceAndSendNotification = async (bookingDetails, rideId) => {

  const price = await getTotalPrice(bookingDetails);
  await RideModel.updateOne({ _id: rideId }, {
    $set: {
      totalPrice: price?.totalPrice?.toFixed(2),
      totalDistance: parseFloat(price?.distance)
    }
  });
  await sendNotificationToAdmin(rideId, 'NEW_LEAD')

}

const saveBooking = async (req, res) => {
  try {
    const { body, user } = req;
    const isCityCab = body?.bookingDetails?.tripType === 'cityCab'
    const bookingData = {
      name: body.userDetails.name,
      vehicleId: body.bookingDetails?.vehicleId,
      userId: user._id,
      pickupDate: {
        date: String(new Date(body?.bookingDetails?.pickUpDate).getDate()).padStart(2, '0'),
        month: String(new Date(body?.bookingDetails?.pickUpDate).getMonth() + 1).padStart(2, '0'),
        year: new Date(body.bookingDetails?.pickUpDate).getFullYear(),
      },
      pickupTime: body.bookingDetails?.pickUpTime,
      trip: {
        tripType: body?.bookingDetails?.tripType,
        hourlyType: body?.bookingDetails?.hourlyType
      },
    };

    if (isCityCab) {
      bookingData['pickupLocation'] = body?.bookingDetails?.from?.name
      bookingData['dropoffLocation'] = body?.bookingDetails?.to[0]?.name
    } else {
      bookingData['pickUpCity'] = body?.bookingDetails?.from?._id
      bookingData['dropCity'] = body?.bookingDetails?.to?.map(ele => ele._id)
      bookingData['pickupLocation'] = body?.userDetails?.pickupAddress
      bookingData['dropoffLocation'] = body?.userDetails?.dropAddress
    }
    if (body?.bookingDetails?.returnDate) {
      bookingData['dropDate'] = {
        date: String(new Date(body?.bookingDetails?.returnDate).getDate()).padStart(2, '0'),
        month: String(new Date(body?.bookingDetails?.returnDate).getMonth() + 1).padStart(2, '0'),
        year: new Date(body?.bookingDetails?.returnDate).getFullYear(),
      }
    }
    // bookingData['bookingNo'] = getNewBookingNumber(lastBookingDetails[0]?.bookingNo)
    const ride = await RideModel.create(bookingData);
    await incrementBookingNumber(ride._id)
    if (!res) {
      updatePriceAndSendNotification(body?.bookingDetails, ride._id)
      return { rideId: ride._id }
    }
    else {
      await updatePriceAndSendNotification(body?.bookingDetails, ride._id)
      res.status(200).send({ booking_id: ride._id });
    }
  } catch (error) {
    logger.log('server/managers/client.manager.js-> saveBooking', { error: error })
    if (res)
      res.status(500).send({ message: 'Server Error' })
  }
}

const getBookingList = async (req, res) => {
  try {
    const { user, query } = req;
    const { filter = 'all', skip = 0, limit = 15 } = query;

    const today = new Date();
    const currentYear = String(today.getFullYear());
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS, so add 1
    const currentDay = String(today.getDate()).padStart(2, '0');

    // Build the match query based on the filter
    let matchQuery = {};
    switch (filter) {
      case 'past':
        matchQuery = {
          $or: [
            { "pickupDate.year": { $lt: currentYear } },
            { $and: [{ "pickupDate.year": currentYear }, { "pickupDate.month": { $lt: currentMonth } }] },
            { $and: [{ "pickupDate.year": currentYear }, { "pickupDate.month": currentMonth }, { "pickupDate.date": { $lt: currentDay } }] }
          ]
        };
        break;
      case 'today':
        matchQuery = {
          "pickupDate.year": currentYear,
          "pickupDate.month": currentMonth,
          "pickupDate.date": currentDay
        };
        break;
      case 'upcoming':
        matchQuery = {
          $or: [
            { "pickupDate.year": { $gt: currentYear } },
            { $and: [{ "pickupDate.year": currentYear }, { "pickupDate.month": { $gt: currentMonth } }] },
            { $and: [{ "pickupDate.year": currentYear }, { "pickupDate.month": currentMonth }, { "pickupDate.date": { $gt: currentDay } }] }
          ]
        };
        break;
      default:
        // No additional filtering for 'all'
        matchQuery = {};
        break;
    }

    // Fetch the bookings with filtering, pagination, and sorting
    const bookingList = await RideModel.aggregate([
      {
        $match: { userId: user._id, ...matchQuery }
      },
      { $sort: { createdOn: -1 } },
      { $skip: Number(skip) },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: 'payments',
          localField: 'paymentId',
          foreignField: '_id',
          as: 'bookingPayment'
        }
      },
      {
        $unwind: {
          path: '$bookingPayment',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          name: 1,
          bookingNo: 1,
          pickupDate: 1,
          pickupTime: 1,
          trip: 1,
          dropDate: 1,
          payableAmount: '$bookingPayment.payableAmount',
          dueAmount: '$bookingPayment.dueAmount',
          totalPrice: 1,
          rideStatus: 1
        }
      }])
    res.status(200).send({ list: bookingList });
  } catch (error) {
    logger.log('server/managers/client.manager.js-> getBookingList', { error: error });
    res.status(500).send({ message: 'Server Error' });
  }
};

const getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const bookingDetails = await RideModel.findOne({ _id: new ObjectId(bookingId) })
      .populate([
        { path: 'pickUpCity', select: 'name' },
        { path: 'dropCity', select: 'name' },
        { path: 'vehicleId', select: 'vehicleType vehicleName' },
        { path: 'paymentId', select: 'dueAmount' }
      ]).lean();
    return res.status(200).send({ bookingDetails });
  } catch (error) {
    logger.log('server/managers/client.manager.js-> getBookingById', { error: error })
    res.status(500).send({ message: 'Server Error' })
  }
};

const validateCalculateCouponCode = async (bookingDetails, coupon) => {

  if (!coupon)
    return { status: 400, message: 'Invalid coupon or may be expired' }
  if (!coupon?.isActive)
    return { status: 400, message: 'Invalid coupon or may be expired' }
  if (new Date() > coupon.expiryDate)
    return { status: 400, message: 'Invalid coupon or may be expired' }
  if (coupon?.usedUser.find(ele => String(ele) === String(user._id)))
    return { status: 400, message: 'You already use this coupon' }
  if (coupon?.minPurchaseAmount > bookingDetails.totalPrice)
    return { status: 400, message: `Booking Price should be minimum ${coupon?.minPurchaseAmount}` }
  const discountAmount = (bookingDetails.totalPrice * coupon.discountValue) / 100
  if (discountAmount > coupon.maxDiscountAmount) {
    return {
      status: 200,
      message: `Coupon Applied Successfully`,
      discountDetails: {
        discountPercent: coupon.discountValue,
        maxDiscountAmount: coupon.maxDiscountAmount,
        discountAmount: coupon.maxDiscountAmount
      }
    }
  } else return {
    status: 200,
    message: `Coupon Applied Successfully`,
    discountDetails: {
      discountPercent: coupon.discountValue,
      discountAmount
    }
  }
}





const applyCopounCode = async (req, res) => {
  try {
    const { user, params } = req
    const coupon = await CouponModel.findOne({ code: params.couponCode })
    const bookingDetails = await RideModel.findOne({ _id: new ObjectId(params.bookingId) }, { totalPrice: 1 })
    const couponValidate = await validateCalculateCouponCode(bookingDetails, coupon)
    return res.status(couponValidate.status).send({ message: couponValidate.message, discountDetails: couponValidate?.discountDetails })
  } catch (error) {
    logger.log('server/managers/client.manager.js-> applyCopounCode', { error: error })
    res.status(500).send({ message: 'Server Error' })
  }
}

const initiatePayment = async (req, res) => {
  try {
    const { body } = req
    let couponDetails = { discountAmount: 0 }
    const bookingDetails = await RideModel.findOne({ _id: new ObjectId(body.bookingId) }).lean()
    if (body?.coupon?.isApply) {
      const coupon = await CouponModel.findOne({ code: body.coupon.code })
      const couponValidate = await validateCalculateCouponCode(bookingDetails, coupon)
      if (couponValidate.status !== 200)
        return res.status(couponValidate.status).send({ message: couponValidate.message })
      else
        couponDetails = { ...couponValidate.discountDetails, couponCode: coupon.code }
    }
    const advancePercentage = [10, 25, 50, 100].includes(body?.advancePercentage) ? body?.advancePercentage : null;
    const afterDiscountPayble = bookingDetails.totalPrice - couponDetails.discountAmount
    const paymentData = {
      bookingId: bookingDetails._id,
      userId: req.user._id,
      createdBy: req.user._id,
      updateBy: req.user._id,
      totalPrice: bookingDetails.totalPrice,
      couponCode: couponDetails?.couponCode || null,
      totalDistance: bookingDetails.totalDistance,
      payableAmount: afterDiscountPayble,
      dueAmount: afterDiscountPayble
    }
    if (advancePercentage) {
      const payablecouponCodeAmount = roundToDecimalPlaces((afterDiscountPayble * advancePercentage) / 100)
      paymentData['advancePercent'] = advancePercentage
      if (payablecouponCodeAmount === 'NAN') {
        res.status(400).send({ message: 'Something Went wrong' })
      }
      const phonePayPayload = {
        amount: payablecouponCodeAmount,
        merchantTransactionId: String(new ObjectId()),
      }
      const result = await initiatePhonepePayment(phonePayPayload)
      const billingData = {
        merchantTransactionId: result?.data.merchantTransactionId,
        userId: req.user._id,
        bookingId: bookingDetails._id,
        amount: phonePayPayload.amount,
        currency: 'INR',
        paymentUrl: result?.data?.instrumentResponse?.redirectInfo?.url,
        paymentState: result.code,
        paymentType: advancePercentage < 100 ? 'advanced' : 'full'
      }
      let paymentId = bookingDetails?.paymentId;
      if (bookingDetails?.paymentId) {
        await PaymentModel.updateOne({ _id: bookingDetails?.paymentId }, { $set: paymentData })
      } else {
        const payment = await PaymentModel.create(paymentData)
        paymentId = payment._id
      }
      billingData['paymentId'] = paymentId
      await RideModel.updateOne({ _id: bookingDetails._id }, { $set: { paymentId: paymentId } })
      await BillingModel.create(billingData)
      return res.status(200).send({ paymentUrl: result?.data?.instrumentResponse?.redirectInfo?.url })
    } else {
      paymentData['isPayLater'] = true
      let paymentId = bookingDetails?.paymentId;
      if (bookingDetails?.paymentId) {
        await PaymentModel.updateOne({ _id: bookingDetails?.paymentId }, { $set: paymentData })
      } else {
        const payment = await PaymentModel.create(paymentData)
        paymentId = payment._id
      }
      await RideModel.updateOne({ _id: bookingDetails._id }, { $set: { paymentId: paymentId, rideStatus: 'booked' } })
      if (process.env.NODE_ENV !== 'development') {
        sendNotificationToAdmin(bookingDetails._id, 'NEW_BOOKING')
        sendNotificationToClient(bookingDetails._id, 'BOOKING_CONFIRM')
      }

      bookigSchedule(bookingDetails._id)
      return res.status(200).send({ message: 'Ride Bokked successfully' })
    }
  } catch (error) {
    logger.log('server/managers/client.manager.js-> bookingPayment', { error: error })
    res.status(500).send({ message: 'Server Error' })
  }
}

const initiateDuePayment = async (req, res) => {
  try {
    const { body } = req

    const bookingDetails = await RideModel.findOne({ _id: new ObjectId(body.bookingId) }, { paymentId: 1, totalPrice: 1, totalDistance: 1 }).lean()
    const paymentDetails = await PaymentModel.findOne({ _id: bookingDetails.paymentId }).lean()
    if (paymentDetails.dueAmount) {
      const phonePayPayload = {
        amount: roundToDecimalPlaces(paymentDetails.dueAmount),
        merchantTransactionId: String(new ObjectId()),
      }
      const result = await initiatePhonepePayment(phonePayPayload)
      const billingData = {
        merchantTransactionId: result?.data.merchantTransactionId,
        userId: req.user._id,
        bookingId: bookingDetails._id,
        amount: phonePayPayload.amount,
        currency: 'INR',
        paymentId: bookingDetails.paymentId,
        paymentUrl: result?.data?.instrumentResponse?.redirectInfo?.url,
        paymentState: result.code,
        paymentType: 'due'
      }
      await BillingModel.create(billingData)
      return res.status(200).send({ paymentUrl: result?.data?.instrumentResponse?.redirectInfo?.url })
    }
    return res.status(200).send({ message: 'You dont have any due payment' })
  } catch (error) {
    logger.log('server/managers/client.manager.js-> bookingPayment', { error: error })
    res.status(500).send({ message: 'Server Error' })
  }
}

const changePaymentStatus = async (req, res) => {
  try {
    const { params } = req
    if (!params.transactionId)
      return res.status(400).send({ message: "Invalid Request" })
    const billing = await BillingModel.findOne({ merchantTransactionId: String(params.transactionId), userId: req.user._id })
    if (!billing)
      return res.status(400).send({ message: "Invalid Request" })
    const result = await chackStatusPhonepePayment({ merchantTransactionId: params.transactionId })
    const billingData = {
      transactionId: result?.data.transactionId,
      paymentInstrument: result?.data?.paymentInstrument,
      paymentState: result?.code,
    }
    await BillingModel.updateOne({ merchantTransactionId: String(billing.merchantTransactionId), userId: req.user._id }, {
      $set: billingData,
      $push: { gatewayResponse: result }
    })
    if (result?.code === 'PAYMENT_SUCCESS') {
      const payment = await PaymentModel.findOne({ _id: billing.paymentId }).lean()
      const dueAmount = roundToDecimalPlaces(payment.dueAmount - (result.data.amount / 100))
      const paymentUpdateData = {
        dueAmount
      }
      if (billing.paymentType === 'advanced') {
        paymentUpdateData['isAdvancePaymentCompleted'] = true
        await RideModel.updateOne({ _id: billing.bookingId }, { $set: { rideStatus: 'booked' } })
        await PaymentModel.updateOne({ _id: billing.paymentId }, { $set: paymentUpdateData })
        sendNotificationToAdmin(billing.bookingId, 'NEW_BOOKING')
      }
      else if (['due', 'full'].includes(billing.paymentType)) {
        await PaymentModel.updateOne({ _id: billing.paymentId }, { $set: paymentUpdateData })
        sendNotificationToAdmin(billing.bookingId, billing.paymentType === 'due' ? 'DUE_PAYMENT_RECEIVED' : 'NEW_BOOKING')
      }
    }
    return res.status(200).send({ message: result.message, bookingId: billing.bookingId })
  } catch (error) {
    logger.log('server/managers/client.manager.js-> bookingPayment', { error: error })
    return res.status(500).send({ message: 'Server Error' })
  }
}

const bookingCancel = async (req, res) => {
  try {
    const { params, body } = req
    if (!params?.bookingId)
      return res.status(400).send({ message: 'Booking Id required' })
    const bokkingDetails = await RideModel.findOne({ _id: new ObjectId(params.bookingId) })
    const isNotValid = isSchedulabel(bokkingDetails.pickupDate, bokkingDetails.pickupTime)
    if (isNotValid) {
      return res.status(400).send({ message: "Rescheduling is not allowed within 2 hours of the ride. " })
    } else {
      await RideModel.updateOne({ _id: new ObjectId(params.bookingId) }, {
        $set: {
          rideStatus: 'cancelled',
          reason: body?.reason
        }
      })
    }

    await sendNotificationToAdmin(new ObjectId(params.bookingId), 'BOOKING_CANCEL')
    await sendNotificationToClient(new ObjectId(params.bookingId), 'BOOKING_CANCEL')

    return res.status(200).send({ message: 'Booking cancel successfull' })
  } catch (error) {
    logger.log('server/managers/client.manager.js-> bookingCancel', { error: error })
    res.status(500).send({ message: 'Server Error' })
  }
}


const bookingReshuduled = async (req, res) => {
  try {
    const { params, body } = req

    const bookingDetails = await RideModel.findOne({ _id: new ObjectId(params.bookingId) }).populate([
      { path: 'vehicleId', select: 'driverAllowance costPerKmRoundTrip' },
      { path: 'paymentId', select: 'dueAmount advancePercent couponCode payableAmount' },
    ]).lean()

    if (!bookingDetails) {
      return res.status(400).send({ message: "Booking not found" })
    }
    const isNotValid = isSchedulabel(bookingDetails.pickupDate, bookingDetails.pickupTime)
    if (isNotValid) {
      return res.status(400).send({ message: "Rescheduling is not allowed within 2 hours of the ride." })
    }
    let data = {
      pickupDate: {
        date: String(new Date(body.reshedulePickupDate).getDate()).padStart(2, '0'),
        month: String(new Date(body.reshedulePickupDate).getMonth() + 1).padStart(2, '0'),
        year: String(new Date(body.reshedulePickupDate).getFullYear()).padStart(2, '0'),
      },
      pickupTime: body.reshedulePickupTime,
      rideStatus: 'booked',
      trip: bookingDetails?.trip
    }
    let oldData = {
      pickupDate: bookingDetails?.pickupDate,
      pickupTime: bookingDetails?.pickupTime,
      trip: bookingDetails?.trip
    }
    if (bookingDetails.trip.tripType === 'roundTrip') {
      let numberOfDay = dateDifference(body.reshedulePickupDate, body.resheduleReturnDate)
      let totalPrice = 0
      let totalDistance = 0
      if (bookingDetails?.totalDistance <= numberOfDay * 250) {
        totalDistance = numberOfDay * 300
        totalPrice = numberOfDay * 300 * bookingDetails?.vehicleId?.costPerKmRoundTrip + numberOfDay * bookingDetails?.vehicleId?.driverAllowance;
      } else {
        totalDistance = bookingDetails?.totalDistance
        totalPrice = bookingDetails?.totalDistance * bookingDetails?.vehicleId?.costPerKmRoundTrip + (numberOfDay * bookingDetails?.vehicleId?.driverAllowance || 0);
      }
      let coupanDiscount = 0
      if (bookingDetails?.paymentId?.couponCode) {
        const refCoupon = await CouponModel.findOne({ code: bookingDetails?.paymentId?.couponCode }, { discountValue: 1 })
        coupanDiscount = roundToDecimalPlaces((refCoupon?.discountValue * totalPrice) / 100)
      }

      let payableAmount = roundToDecimalPlaces(totalPrice - coupanDiscount)
      let dueAmount = roundToDecimalPlaces(payableAmount - (bookingDetails?.paymentId?.advancePercent ? (payableAmount * bookingDetails?.paymentId?.advancePercent) / 100 : 0))

      data = {
        ...data,
        payableAmount,
        dueAmount,
        totalPrice,
        totalDistance,
        dropDate: {
          date: String(new Date(body.resheduleReturnDate).getDate()).padStart(2, '0'),
          month: String(new Date(body.resheduleReturnDate).getMonth()).padStart(2, '0'),
          year: String(new Date(body.resheduleReturnDate).getFullYear()).padStart(2, '0'),
        },
        totalPrice: totalPrice
      }
      oldData = {
        ...oldData,
        dropDate: bookingDetails?.dropDate,
        totalPrice: totalPrice
      }

      await PaymentModel.updateOne({ _id: bookingDetails?.paymentId?._id }, { payableAmount: payableAmount, dueAmount: dueAmount })

      console.log(payableAmount, dueAmount, totalPrice, totalDistance, coupanDiscount)
    }

    await RideModel.updateOne({ _id: new ObjectId(params.bookingId) }, {
      $set: data,
      $push: { activity: oldData }
    })
    if (process.env.NODE_ENV !== 'development') {
      sendNotificationToClient(bookingDetails?._id, 'BOOKING_RESCHEDULED')
      sendNotificationToAdmin(bookingDetails?._id, 'BOOKING_RESCHEDULED')
    }
    return res.status(200).send({ message: 'Booking reschedule successfully', booking: data })
  } catch (error) {
    logger.log('server/managers/client.manager.js-> bookingReshuduled', { error: error })
    res.status(500).send({ message: 'Server Error' })
  }
}


const getCoupons = async (req, res) => {
  try {
    const currentDate = new Date();
    const userId = req.userId;

    const count = await RideModel.countDocuments({
      userId: userId,
      rideStatus: 'completed'
    });

    const query = {
      isActive: true,
      expiryDate: { $gte: currentDate }
    };

    if (userCondition === 0) {
      // For all users
    } else if (userCondition === 1) {
      // For only new users with a count of 0
      if (count === 0) {
        query.userCondition = {
          $eq: 0
        };
      } else {
        // If count is not 0, exclude this condition
        query.userCondition = {
          $exists: false
        };
      }
    } else {
      // For other cases where userCondition is less than the count
      query.userCondition = {
        $lt: count
      };
    }
    const coupons = await CouponModel.find(query).lean();
    console.log(coupons);

    res.status(200).send({ coupons });
  } catch (error) {
    logger.log('server/managers/client.manager.js-> getCoupons', { error: error });
    res.status(500).send({ message: 'Server Error' });
  }
}

const getInvoiceInfo = async (req, res) => {
  try {
    const bookingId = req?.params?.id
    let bookingDetails = await RideModel.findOne({ _id: new ObjectId(bookingId) })
      .populate([
        { path: 'pickUpCity', select: 'name' },
        { path: 'dropCity', select: 'name' },
        { path: 'vehicleId', select: 'vehicleType vehicleName' },
        { path: 'paymentId', select: 'dueAmount invoiceNo advancePercent couponCode payableAmount extraAmount totalDistance totalPrice extraDistance isPaymentCompleted ' },
        { path: 'userId', select: 'primaryPhone email' }
      ]).lean();
    if (bookingDetails?.paymentId?.couponCode) {
      const refCoupon = await CouponModel.findOne({ code: bookingDetails?.paymentId?.couponCode }, { discountValue: 1 })
      console.log(refCoupon)
      bookingDetails['discountValue'] = (refCoupon?.discountValue * bookingDetails?.paymentId?.totalPrice) / 100
    }
    const html = generateInvoiceHTML(bookingDetails)
    let pdfContent = await getPdfFromHtml(html)

    return res.status(200).send(pdfContent);
  } catch (error) {
    logger.log('server/managers/client.manager.js-> getInvoiceInfo', { error: error, userId: req?.userId });
    res.status(500).send({ message: 'Server Error' });
  }
}

module.exports = {
  getCities,
  getCars,
  saveBooking,
  getBookingList,
  getBookingById,
  getAddressSuggestion,
  getAddressSuggestionOnLandingPage,
  applyCopounCode,
  initiatePayment,
  bookingCancel,
  bookingReshuduled,
  getCoupons,
  changePaymentStatus,
  initiateDuePayment,
  savePackage,
  saveContact,
  getInvoiceInfo
};
