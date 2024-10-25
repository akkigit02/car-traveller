const { dateDifference, estimateRouteDistance } = require("../utils/calculation.util");
const { log } = require("../utils/logger.util");
const { getDistanceBetweenPlaces } = require("./GooglePlaces.service");
const CitiesModel = require("../models/cities.model");
const PricingModel = require("../models/pricing.model");
const { CITY_CAB_PRICE } = require("../constants/common.constants");


const getCityCoordinates = async (cityName) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: cityName,
          format: 'json'
        }
      });
  
      if (response.data.length === 0) {
        throw new Error('City not found');
      }
  
      const { lat, lon } = response.data[0];
      return { lat, lon };
    } catch (error) {
      log('getCityCoordinates', error)
      return null;
    }
  };

const getDistanceOfTwoCities = async(from, to) => {
    try {
        const start = await getCityCoordinates(from);
        const end = await getCityCoordinates(to);
        const distance = estimateRouteDistance(start.lat, start.lon, end.lat, end.lon)
        return distance;
    } catch (error) {
       console.log(error) 
    }
}

// {
//   "bookingType": "roundTrip",
//   "name": "cdsa",
//   "primaryPhone": "2345676545",
//   "pickupCity": "Pune, Maharashtra",
//   "bookingDate": "2024-09-21",
//   "pickupTime": "01:00 PM",
//   "returnDate": "2024-09-23",
//   "dropCities": [
//       "66e5ac5d3882e48f1593e8a9",
//       "66e5ac5d3882e48f1593e8c4"
//   ],
//   "vehicleId": "66e5ac5d3882e48f1593f0ef",
//   "pickupLocation": "Pune Railway Station, Agarkar Nagar, Pune, Maharashtra, India",
//   "pickupCityId": "66e5ac5d3882e48f1593e8fc",
//   "dropCityId": "",
//   "pickupLocationId": "ChIJefhvCWPBwjsRM_LoqE9e8j8",
//   "dropLocationId": ""
// }

// let bookingDetails = {
//   tripType: body?.bookingType,
//   from: body?.pickupCityId,
//   to: body?.dropCities,
//   vehicleId: body?.vehicleId,
//   pickUpDate: body?.bookingDate,
//   returnDate: body?.returnDate,
//   hourlyType: body?.hourlyType,
//   pickupCityCab: body?.pickupLocationId,
//   dropCityCab: body?.dropLocationId

// }

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
      let metroCityPrice = 1.4
      if (!toCity?.isMetroCity) metroCityPrice = 2
      let extra = 1
      if(car.vehicleType === 'Traveller') {
        extra = 2
      }

      if(distance < 150 && car.vehicleType !== 'Traveller') {
        if(toCity?.isMetroCity) metroCityPrice = 1
        distance = 200
      }

      if(car?.nonMetroCityPercentage && !toCity?.isMetroCity) {
        metroCityPrice = car?.nonMetroCityPercentage/100
      }
      totalPrice = distance * car.costPerKmOneWay * metroCityPrice * extra + (car?.driverAllowance ? car.driverAllowance : 0);
      totalPrice = totalPrice - (totalPrice * car?.oneWayDiscount)/100;
      
    } else if (bookingDetails?.tripType === "roundTrip") {
      let cityIds = bookingDetails?.to?.map((vehicle) => vehicle._id || vehicle);
      cityIds.unshift(bookingDetails?.from?._id || bookingDetails?.from);

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

      if (distance <= numberOfDay * 250) {
        totalPrice =
          numberOfDay * 300 * car.costPerKmRoundTrip + numberOfDay * car.driverAllowance;
      } else {
        totalPrice =
          distance * car.costPerKmRoundTrip + numberOfDay * car.driverAllowance || 0;
      }

      totalPrice = totalPrice - (totalPrice * car?.roundTripDiscount)/100
    } else if (bookingDetails?.tripType === "hourly") {
      fromDetail = await CitiesModel.findOne({ _id: bookingDetails.from }).lean();
      let hourlyData = car.hourly.find(hr => hr.type === bookingDetails.hourlyType)
      if (hourlyData) {
        totalPrice = hourlyData.basePrice + car.driverAllowance || 0;
        totalPrice = totalPrice - (totalPrice * car?.houlyDiscount)/100
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
      } else if (['Hatchback'].includes(car.vehicleType)) {
        totalPrice = priceInfo.hatchback.base + priceInfo.hatchback.perKm * distance
      } else {
        totalPrice = priceInfo.suv.base + priceInfo.suv.perKm * distance
      }
      totalPrice = totalPrice - (totalPrice * car?.cityCabDiscount)/100
    }

    return { totalPrice, toDetail, distance: distance?.toFixed(2) };
  } catch (error) {
    console.log(error)
  }
};


module.exports = {
    getDistanceOfTwoCities,
    getTotalPrice
}