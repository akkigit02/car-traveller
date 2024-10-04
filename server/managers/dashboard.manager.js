const { MONTH_NAME, MONTH_NUMBER } = require('../constants/common.constants');
const RideModel = require('../models/ride.model')
const PriceModel = require('../models/pricing.model')



const getBookingCount = async (req, res) => {
    // Get the current date components
    const now = new Date();
    let currentDay = String(now.getDate()).padStart(2, '0'); // Two-digit day
    let currentMonth = String(now.getMonth() + 1).padStart(2, '0'); // Two-digit month (0-indexed)
    let currentYear = String(now.getFullYear());
    try {
      const result = await RideModel.aggregate([
        {
          $facet: {
            upcomingRides: [
              {
                $match: {
                  $or: [
                    { "pickupDate.year": { $gt: currentYear } },
                    { $and: [{ "pickupDate.year": currentYear }, { "pickupDate.month": { $gt: currentMonth } }] },
                    { $and: [{ "pickupDate.year": currentYear }, { "pickupDate.month": currentMonth }, { "pickupDate.date": { $gt: currentDay } }] }
                  ]
                }
              },
              { $count: "count" }
            ],
            pastRides: [
              {
                $match: {
                  $or: [
                    { "pickupDate.year": { $lt: currentYear } },
                    { $and: [{ "pickupDate.year": currentYear }, { "pickupDate.month": { $lt: currentMonth } }] },
                    { $and: [{ "pickupDate.year": currentYear }, { "pickupDate.month": currentMonth }, { "pickupDate.date": { $lt: currentDay } }] }
                  ]
                }
              },
              { $count: "count" }
            ],
            todayRides: [
              {
                $match: {
                  "pickupDate.year": currentYear,
                  "pickupDate.month": currentMonth,
                  "pickupDate.date": currentDay
                }
              },
              { $count: "count" }
            ]
          }
        }
      ]);
  
      const rideCounts = {
        upcomingRides: result[0].upcomingRides[0] ? result[0].upcomingRides[0].count : 0,
        pastRides: result[0].pastRides[0] ? result[0].pastRides[0].count : 0,
        todayRides: result[0].todayRides[0] ? result[0].todayRides[0].count : 0,
      };
      console.log(rideCounts,"======--------")
      res.status(200).send({rideCounts})
    } catch (error) {
      logger.log('server\managers\dashboard.manager.js -> getBookingCount', { error: error })
    res.status(500).send({ message: 'Server Error' })
    }
  };

  const getBookingRevenues = async (req, res) => {
    try {
      const { query } = req;
      const result = await RideModel.aggregate([
        {
          // Match rides only from the specified year
          $match: {
            "pickupDate.year": query.year,
            paymentStatus: 'completed'
          }
        },
        {
          $group: {
            _id: "$pickupDate.month",
            totalPrice: { $sum: "$totalPrice" },
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);
      
      let monthly = []
      let revenue = []
      const revenueData = {};
      result.forEach(item => {
        revenueData[item._id.padStart(2,'0')] = item.totalPrice;
      });

      MONTH_NUMBER.map(month => {
        monthly.push(MONTH_NAME[month])   
        revenue.push(revenueData[month]?.toFixed() || 0)
      });

      res.status(200).send({monthly, revenue})
    } catch (error) {
      logger.log('server\managers\dashboard.manager.js -> getBookingRevenues', { error: error })
      res.status(500).send({ message: 'Server Error' })
    }
  }

  const getBookingRevenuesByCarType = async (req, res) => {
    try {
      const { query } = req;
      const vehicle = await PriceModel.find({},{ vehicleType: 1})
      const vehicleTypes = vehicle.map(li => li.vehicleType)
      const result = await RideModel.aggregate([
        {
          // Match rides only from the specified year
          $match: {
            "pickupDate.year": query.year,
            paymentStatus: 'completed'
          }
        },
        {
          $lookup: {
            from: 'prices',
            localField: 'vehicleId',
            foreignField: '_id',
            as:'vehiclePrice',
            pipeline: [{
              $project: {
                vehicleType: 1
              }
            }]
          }
        },
        {
          $unwind: {
            path: '$vehiclePrice',
            preserveNullAndEmptyArrays: false
          }
        },
        {
          $group: {
            _id: "$vehiclePrice.vehicleType",
            totalPrice: { $sum: "$totalPrice" },
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);
      console.log(result)
      let carTypes = []
      let revenue = []
      const revenueData = {};
      result.forEach(item => {
        revenueData[item._id] = item.totalPrice;
      });

      vehicleTypes.map(car => {
        carTypes.push(car)   
        revenue.push(revenueData[car]?.toFixed() || 0)
      });

      res.status(200).send({carTypes, revenue})
    } catch (error) {
      logger.log('server\managers\dashboard.manager.js -> getBookingRevenuesByCarType', { error: error })
      res.status(500).send({ message: 'Server Error' })
    }
  }

  const getRecentBooking = async (req, res) => {
    try {
      const now = new Date();
      let currentDay = String(now.getDate()).padStart(2, '0'); // Two-digit day
      let currentMonth = String(now.getMonth() + 1).padStart(2, '0'); // Two-digit month (0-indexed)
      let currentYear = String(now.getFullYear());

      const rideBooking = await RideModel.find({
        $or: [
          { "pickupDate.year": { $gte: currentYear } },
          { $and: [{ "pickupDate.year": currentYear }, { "pickupDate.month": { $gte: currentMonth } }] },
          { $and: [{ "pickupDate.year": currentYear }, { "pickupDate.month": currentMonth }, { "pickupDate.date": { $gte: currentDay } }] }
        ],
        paymentStatus: {$ne: 'pending'}
      },{vehicleId: 1, name: 1, userId: 1, pickupDate: 1, pickupTime:1, totalPrice: 1, totalDistance: 1, paymentStatus: 1}).populate([
        { path: 'userId', select: 'name primaryPhone' },
        { path: 'vehicleId', select: 'vehicleType vehicleName' },
      ]).limit(15)

      res.status(200).send({rideBooking})
    } catch (error) {
      logger.log('server\managers\dashboard.manager.js -> getRecentBooking', { error: error })
      res.status(500).send({ message: 'Server Error' })
    }
  }

  const getRecentLead = async (req, res) => {
    try {
      const now = new Date();
      let currentDay = String(now.getDate()).padStart(2, '0'); // Two-digit day
      let currentMonth = String(now.getMonth() + 1).padStart(2, '0'); // Two-digit month (0-indexed)
      let currentYear = String(now.getFullYear());
      console.log(currentDay,currentMonth, currentYear)
      const rideBooking = await RideModel.find({
        $or: [
          { "pickupDate.year": { $gte: currentYear } },
          { $and: [{ "pickupDate.year": currentYear }, { "pickupDate.month": { $gte: currentMonth } }] },
          { $and: [{ "pickupDate.year": currentYear }, { "pickupDate.month": currentMonth }, { "pickupDate.date": { $gte: currentDay } }] }
        ],
        paymentStatus: 'pending'
      },{vehicleId: 1, name: 1, userId: 1, pickupDate: 1, totalPrice: 1, totalDistance: 1, paymentStatus: 1}).populate([
        { path: 'userId', select: 'name primaryPhone' },
        { path: 'vehicleId', select: 'vehicleType vehicleName' },
      ]).limit(15)
      res.status(200).send({rideBooking})
    } catch (error) {
      logger.log('server\managers\dashboard.manager.js -> getRecentBooking', { error: error })
      res.status(500).send({ message: 'Server Error' })
    }
  }

module.exports = {
    getBookingCount,
    getBookingRevenues,
    getBookingRevenuesByCarType,
    getRecentBooking,
    getRecentLead
}

