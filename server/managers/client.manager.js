const ObjectId = require('mongoose').Types.ObjectId
const CitiesModel = require("../models/cities.model");
const RideModel = require("../models/ride.model");
const PricingModel = require("../models/pricing.model");
const UserModel = require("../models/user.model");
const EnquirePackageModel = require("../models/enquire.package.model")
const {
  estimateRouteDistance,
  dateDifference,
} = require("../utils/calculation.util");
const { getAutoSearchPlaces, getDistanceBetweenPlaces } = require("../services/GooglePlaces.service");
const { CITY_CAB_PRICE } = require('../constants/common.constants');

const getCities = async (req, res) => {
  try {
    const search = req?.query?.search;
    const cities = await CitiesModel.aggregate([
      {
        $addFields: { city_name: { $concat: ["$name", ", ", "$state_name"] } },
      },
      {
        $match: { city_name: { $regex: search, $options: "i" } },
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
      console.log(toCity)
      let metroCityPrice = 1
      if (!toCity?.isMetroCity) metroCityPrice = 1.75

      for (let car of cars) {
        car["totalPrice"] =
          distance * car.costPerKm * metroCityPrice + (car?.driverAllowance ? car.driverAllowance : 0);

        car['showDistance'] = distance?.toFixed(2);
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
        // if(i+1 < cityIds.length - 1)
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
      if (numberOfDay == 0) numberOfDay = 1
      for (let car of cars) {
        if (distance <= numberOfDay * 300) {
          car["totalPrice"] =
            numberOfDay * 300 * car.costPerKm +
            numberOfDay * car.driverAllowance;
          car['showDistance'] = numberOfDay * 250
        } else {
          car["totalPrice"] =
            distance * car.costPerKm + numberOfDay * car.driverAllowance || 0;

          car['showDistance'] = numberOfDay * 300
        }
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
          carList.push(car);
        }
        hourlyCarDetails = [...car.hourly, ...hourlyCarDetails]
      }

    } else if (search?.tripType === 'cityCab') {
      const data = await getDistanceBetweenPlaces(search?.pickupCityCab, search?.dropCityCab)
      distance = parseFloat(data?.distance.replace(/[^0-9.]/g, ''))
      console.log(distance, "====-------")
      const priceInfo = CITY_CAB_PRICE.find(info => info.max >= distance && info.min <= distance)
      fromDetail = { name: data.from }
      toDetail = [{ name: data.to }]
      cars = cars.filter(vehicle => !['Traveller'].includes(vehicle.vehicleType))
      for (let car of cars) {
        if (['Sedan'].includes(car.vehicleType)) {
          car["totalPrice"] = priceInfo.sedan.base + priceInfo.sedan.perKm * distance
        } else {
          car["totalPrice"] = priceInfo.suv.base + priceInfo.suv.perKm * distance
        }
        car['showDistance'] = distance?.toFixed(2);
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
      let metroCityPrice = 1
      if (!toCity?.isMetroCity) metroCityPrice = 1.75

      totalPrice = distance * car.costPerKm * metroCityPrice + (car?.driverAllowance ? car.driverAllowance : 0);
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
      const priceInfo = CITY_CAB_PRICE.find(info => info.max > distance && info.min < distance)
      fromDetail = { name: data.from }
      toDetail = [{ name: data.to }]
      if (['Sedan'].includes(car.vehicleType)) {
        totalPrice = priceInfo.sedan.base + priceInfo.sedan.perKm * distance
      } else {
        totalPrice = priceInfo.suv.base + priceInfo.suv.perKm * distance
      }
    }

    return { totalPrice, toDetail, distance: distance?.toFixed(2) };
  } catch (error) {
    console.log(error)
  }
};


const updatePriceAndSendNotification = async (bookingDetails, rideId) => {

  const price = await getTotalPrice(bookingDetails);
  await RideModel.updateOne({ _id: rideId }, {
    $set: {
      totalPrice: price?.totalPrice,
      totalDistance: parseFloat(price?.distance)
    }
  });
  // send notification to admin

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
      bookingData['pickUpCity'] = body?.bookingDetails?.from?._id
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
    if (!res) {
      updatePriceAndSendNotification(body?.bookingDetails, ride._id)
      return { rideId: ride._id }
    }
    else {
      await updatePriceAndSendNotification(body?.bookingDetails, ride._id)
      res.status(200).send({ bokking_id: ride._id });
    }
  } catch (error) {
    logger.log('server/managers/client.manager.js-> saveBooking', { error: error })
    if (res)
      res.status(500).send({ message: 'Server Error' })
  }
}




const getBookingList = async (req, res) => {
  try {
    const { user, query } = req
    const bookingList = await RideModel.find({ userId: user._id }, { name: 1, totalPrice: 1, advancePayment: 1, pickupDate: 1, pickupTime: 1 }).sort({ createdOn: 1 }).skip(0).limit(15).lean()
    res.status(200).send({ list: bookingList });
  } catch (error) {
    logger.log('server/managers/client.manager.js-> getBookingList', { error: error })
    res.status(500).send({ message: 'Server Error' })
  }
};
const getBookingByPasssengerId = async (req, res) => {
  try {
    const passengerId = req.params.id;
    const booking = await RideModel.find({ passengerId }).lean();
    res.status(200).send({ booking });
  } catch (error) {
    logger.log('server/managers/client.manager.js-> getBookingByPasssengerId', { error: error })
    res.status(500).send({ message: 'Server Error' })
  }
};
const cancelBooking = async (req, res) => {
  try {
    const rideId = req.params.id;
    const ride = await RideModel.findOne({ _id: rideId });

    if (!ride) {
      return res.status(404).send({ message: "Ride not found" });
    }

    const { pickupDate, pickupTime, status } = ride;

    if (status === "cancelled") {
      return res.status(500).send({ message: "Ride is Already Cancelled" });
    }

    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);

    const currentTime = new Date();

    const timeDifference = (pickupDateTime - currentTime) / (1000 * 60);

    if (timeDifference < 90) {
      return res.status(400).send({
        message:
          "Ride can only be cancelled before 90 minutes of the pickup time",
      });
    }

    await RideModel.findOneAndUpdate({ _id: rideId }, { status: "cancelled" });
    return res.status(200).send({ message: "Ride cancelled successfully" });
  } catch (error) {
    logger.log('server/managers/client.manager.js-> cancelBooking', { error: error })
    res.status(500).send({ message: 'Server Error' })
  }
};


const getBookingDeatils = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const bookingDetails = await RideModel.findOne({ _id: new ObjectId(bookingId) })
      .populate([
        { path: 'pickUpCity', select: 'name' },
        { path: 'dropCity', select: 'name' },
        { path: 'vehicleId', select: 'modelName' },
      ])
      .lean();
    return res.status(200).send({ bookingDetails });
  } catch (error) {
    logger.log('server/managers/client.manager.js-> getBookingDeatils', { error: error })
    res.status(500).send({ message: 'Server Error' })
  }
};

const sendPackageEnquire = async (req, res) => {
  try {
    const body = req.body;
    await EnquirePackageModel.create(body)
    return res.status(200).send({ message: 'Enquire successfully, we will contact you immediately or later' });
  } catch (error) {
    logger.log('server/managers/client.manager.js-> sendPackageEnquire', { error: error })
    res.status(500).send({ message: 'Server Error' })
  }
}

module.exports = {
  getCities,
  getCars,
  saveBooking,

  getBookingList,
  getBookingByPasssengerId,
  cancelBooking,
  getAddressSuggestion,
  getAddressSuggestionOnLandingPage,
  getBookingDeatils,
  sendPackageEnquire
};
