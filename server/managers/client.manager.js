const CitiesModel = require("../models/cities.model");
const RideModel = require("../models/ride.model");
const PricingModel = require("../models/pricing.model");
const {
  estimateRouteDistance,
  dateDifference,
} = require("../utils/calculation.util");
const { getAutoSearchPlaces } = require("../services/GooglePlaces.service");

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
    console.log(req.query)
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

// mumbai pune nashik mumbai

const getCars = async (req, res) => {
  try {
    let search = req?.query?.search;
    const cars = await PricingModel.find({}).lean();
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
      for (let car of cars) {
        car["totalPrice"] =
          distance?.toFixed(2) * car.costPerKm + car.driverAllowance;
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
        } else {
          car["totalPrice"] =
            distance * car.costPerKm + numberOfDay * car.driverAllowance;
        }
        carList.push(car);
      }
    } else if (search?.tripType === "hourly") {
      fromDetail = await CitiesModel.findOne({ _id: search.from }).lean();
      for (let car of cars) {
        let hourlyData = car.hourly.find(hr => hr.type === search.hourlyType)
        if (hourlyData) {
          car["totalPrice"] = hourlyData.basePrice + car.driverAllowance;
          car["hour"] = hourlyData.hour
          distance = hourlyData?.distance
          carList.push(car);
        }
        hourlyCarDetails = [...car.hourly, ...hourlyCarDetails]
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
      from: { name: fromDetail.name, _id: fromDetail._id },
      to: toDetail.map(city => ({ name: city.name, _id: city._id })),
      distance: distance.toFixed(2),
      pickUpDate: search.pickUpDate,
      returnDate: search.returnDate,
      pickUpTime: search.pickUpTime,
      hourlyDetails: hourlyDetails
    };
    return res.status(200).send({ cars: carList, bookingDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};
const addBooking = async (req, res) => {
  try {
    let bookingDetails = req.body;
    bookingDetails.status = "completed";
    const booking = await RideModel.create(bookingDetails);
    return res.status(200).send({ booking, message: "Ride has been Booked" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};
const getBooking = async (req, res) => {
  try {
    const booking = await RideModel.find().lean();
    res.status(200).send({ booking });
  } catch (error) {
    console.error(error);
  }
};
const getBookingByPasssengerId = async (req, res) => {
  try {
    const passengerId = req.params.id;
    const booking = await RideModel.find({ passengerId }).lean();
    res.status(200).send({ booking });
  } catch (error) {
    console.error(error);
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
    console.log(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = {
  getCities,
  getCars,
  addBooking,
  getBooking,
  getBookingByPasssengerId,
  cancelBooking,
  getAddressSuggestion
};
