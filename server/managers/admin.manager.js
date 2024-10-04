const PricingModel = require('../models/pricing.model');
const VehicleModel = require('../models/vehicle.model');
const RideModel = require('../models/ride.model')
const PackageModel = require('../models/packages.model');
const EnquirePackage = require('../models/enquire.package.model');
const EnquireContactModel = require("../models/enquire.contact.model")
const CouponModel = require('../models/coupon.model');
const UserModel = require('../models/user.model');
const { getTotalPrice } = require('../services/calculation.service');
const CitiesModel = require('../models/cities.model');
const NotificationModel = require('../models/notification.model')
const { createCSVFile } = require('../utils/csv.util');
const PaymentModel = require('../models/payment.model');
const { CITY_CAB_PRICE } = require('../constants/common.constants');
const { roundToDecimalPlaces } = require('../utils/format.util');
const { dateDifference } = require('../utils/calculation.util');
const { incrementInvoiceNumber, incrementBookingNumber } = require('../services/common.service');
const { bookigSchedule } = require('../services/schedule.service');
const { ObjectId } = require('mongoose').Types

const saveVehiclePrice = async (req, res) => {
    try {
        const price = await PricingModel.create(req.body)
        res.status(201).send({ message: 'Vehicle price add successfully!', price })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> saveVehiclePrice', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

const getVehiclePrice = async (req, res) => {
    try {
        const price = await PricingModel.find().lean();
        res.status(200).send({ price })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getVehiclePrice', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

const updateVehiclePrice = async (req, res) => {
    try {
        await PricingModel.updateOne({ _id: req.body._id }, req.body)
        res.status(200).send({ message: 'Vehicle price update successfully!' })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> updateVehiclePrice', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

const deleteVehiclePrice = async (req, res) => {
    try {
        await PricingModel.deleteOne({ _id: req.params.id })
        res.status(200).send({ message: 'Vehicle price delete successfully!' })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> deleteVehiclePrice', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

const getVehiclePriceById = async (req, res) => {
    try {
        const price = await PricingModel.findOne({ _id: req.params.id })
        res.status(200).send({ price })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getVehiclePriceById', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}
/*********************************Vehicle Detail***********************************************************/
const saveVehicle = async (req, res) => {
    try {
        const price = await VehicleModel.create(req.body)
        res.status(201).send({ message: 'Vehicle add successfully!', price })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> saveVehicle', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

const getVehicle = async (req, res) => {
    try {
        const price = await VehicleModel.find().lean();
        res.status(200).send({ price })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getVehicle', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

const updateVehicle = async (req, res) => {
    try {
        await VehicleModel.updateOne({ _id: req.body._id }, req.body)
        res.status(200).send({ message: 'Vehicle update successfully!' })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> updateVehicle', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

const deleteVehicle = async (req, res) => {
    try {
        await VehicleModel.deleteOne({ _id: req.params.id })
        res.status(200).send({ message: 'Vehicle delete successfully!' })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> deleteVehicle', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

const getVehicleById = async (req, res) => {
    try {
        const price = await VehicleModel.findOne({ _id: req.params.id })
        res.status(200).send({ price })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getVehicleById', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

const getBookingInfo = async (req, res) => {
    try {
        const query = req.query;
        const searchQuery = query.search || '';

        const skipValue = searchQuery ? 0 : Number(query.skip);

        const searchConditions = [
            { rideStatus: { $in: ['completed', 'booked'] } }
        ];

        if (searchQuery) {
            const searchRegex = { $regex: searchQuery, $options: 'i' };
            searchConditions.push({
                $or: [
                    { bookingNo: searchRegex },
                    { name: searchRegex },
                    { 'user.primaryPhone': searchRegex }
                ]
            });
        }

        const bookingList = await RideModel.aggregate([
            {
                $match: { $and: searchConditions }
            },
            { $sort: { createdOn: -1 } },
            { $skip: skipValue },
            { $limit: Number(query.limit) },
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
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [{ $project: { primaryPhone: 1 } }]
                }
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'cities',
                    localField: 'pickUpCity',
                    foreignField: '_id',
                    as: 'city',
                    pipeline: [{ $project: { name: 1 } }]
                }
            },
            {
                $unwind: {
                    path: '$city',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    name: 1,
                    pickupDate: 1,
                    pickupTime: 1,
                    trip: 1,
                    dropDate: 1,
                    payableAmount: '$bookingPayment.payableAmount',
                    dueAmount: '$bookingPayment.dueAmount',
                    isPaymentCompleted: '$bookingPayment.isPaymentCompleted',
                    totalPrice: 1,
                    rideStatus: 1,
                    phone: '$user.primaryPhone',
                    isInvoiceGenerate: 1,
                    name: 1,
                    paymentId: 1,
                    pickUpCity: 1,
                    pickupCityName: '$city.name',
                    pickupLocation: 1,
                    pickupTime: 1,
                    rideStatus: 1,
                    totalDistance: 1,
                    dropoffLocation: 1,
                    bookingNo: 1
                }
            }
        ]);

        res.status(200).send({ bookings: bookingList });
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getBookingInfo', { error: error, userId: req?.userId });
        res.status(500).send({ message: 'Server Error' });
    }
};


const saveBooking = async (req, res) => {
    try {
        const body = req?.body
        const { name, primaryPhone, } = req.body;

        const pickUpCity = await CitiesModel.findOne({ _id: body?.pickupCityId }, { isMetroCity: 1 });

        if (pickUpCity && !pickUpCity?.isMetroCity) {
            return res.status(400).send({ message: 'Please select metro city!' });
        }

        let user = await UserModel.findOne({ primaryPhone });
        if (!user) {
            user = await UserModel.create({ name, primaryPhone, modules: { userType: "CLIENT" } })
        }

        let toCityId = body?.dropCityId
        let dropDate = {
            date: null,
            month: null,
            year: null,
        }
        if (body?.bookingType === 'roundTrip') {
            body?.dropCities.push(body?.pickupCityId)
            toCityId = body?.dropCities
            dropDate = {
                date: String(new Date(body?.returnDate).getDate()).padStart(2, '0'),
                month: String(new Date(body?.returnDate).getMonth() + 1).padStart(2, '0'),
                year: new Date(body?.returnDate).getFullYear(),
            }
        }
        let bookingDetails = {
            tripType: body?.bookingType,
            from: body?.pickupCityId,
            to: toCityId,
            vehicleId: body?.vehicleId,
            pickUpDate: body?.bookingDate,
            returnDate: body?.returnDate,
            hourlyType: body?.hourlyType,
            pickupCityCab: body?.pickupLocationId,
            dropCityCab: body?.dropLocationId
        }

        const booking = await getTotalPrice(bookingDetails)
        const paymentId = new ObjectId()
        let rideInfo = {
            name: body?.name,
            userId: user._id,
            trip: {
                tripType: body?.bookingType,
                hourlyType: body?.hourlyType
            },
            rideStatus: "none",
            source: 'ADMIN',
            pickupLocation: body?.pickupLocation,
            dropoffLocation: body?.dropLocation,
            pickupDate: {
                date: String(new Date(body?.bookingDate).getDate()).padStart(2, '0'),
                month: String(new Date(body?.bookingDate).getMonth() + 1).padStart(2, '0'),
                year: new Date(body?.bookingDate).getFullYear(),
            },
            pickupTime: body?.pickupTime,
            pickUpCity: body?.pickupCityId,
            dropCity: body?.bookingType === 'roundTrip' ? toCityId : [toCityId],
            dropDate: dropDate,
            paymentId: paymentId,
            totalPrice: roundToDecimalPlaces(booking?.totalPrice),
            payablePrice: roundToDecimalPlaces(booking?.totalPrice),
            totalDistance: roundToDecimalPlaces(booking?.distance)
        }


        let info = await RideModel.create(rideInfo);
        await incrementBookingNumber(info._id)
        const paymentInfo = {
            _id: paymentId,
            totalPrice: roundToDecimalPlaces(booking?.totalPrice),
            payableAmount: roundToDecimalPlaces(booking?.totalPrice),
            totalDistance: roundToDecimalPlaces(booking?.distance),
            dueAmount: roundToDecimalPlaces(booking?.totalPrice),
            adadvancePercent: 0,
            userId: user._id,
            bookingId: info._id,
            createdBy: req?.userId,
            updateBy: req?.userId
        }

        let payInfo = await PaymentModel.create(paymentInfo)
        console.log(payInfo, info)
        info = JSON.parse(JSON.stringify(info))
        payInfo = JSON.parse(JSON.stringify(payInfo))
        delete payInfo?._id
        res.status(201).send({
            message: 'Booking created successfully', booking: {
                ...info, ...payInfo
            }
        });
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> saveBooking', { error: error, userId: req?.userId });
        res.status(500).send({ message: 'Server Error' });
    }
};


/*********************************Package Detail***********************************************************/
const savePackage = async (req, res) => {
    try {
        const package = await PackageModel.create(req.body)
        res.status(201).send({ message: 'Package add successfully!', package })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> savePackage', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

const getPackage = async (req, res) => {
    try {
        const package = await PackageModel.find().lean();
        res.status(200).send({ package })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getPackage', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

const updatePackage = async (req, res) => {
    try {
        await PackageModel.updateOne({ _id: req.body._id }, req.body)
        res.status(200).send({ message: 'Package update successfully!' })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> updatePackage', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

const deletePackage = async (req, res) => {
    try {
        await PackageModel.deleteOne({ _id: req.params.id })
        res.status(200).send({ message: 'Package delete successfully!' })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> deletePackage', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

const getPackageById = async (req, res) => {
    try {
        const package = await PackageModel.findOne({ _id: req.params.id })
        res.status(200).send({ package })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getPackageById', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

const getPackageInfo = async () => {
    try {
        const ride = await RideModel.find({}).populate('passengerId', 'firstName lastName')
        res.status(200).send({ ride })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getPackageInfo', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

const getEnquirePackage = async (req, res) => {
    try {
        const packages = await EnquirePackage.find({})
        res.status(200).send({ packages })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getEnquirePackage', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

const getEnquireContact = async (req, res) => {
    try {
        const contacts = await EnquireContactModel.find({})
        res.status(200).send({ contacts })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getEnquireContact', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

/*****************************Referral Code***************************************/

const saveReferral = async (req, res) => {
    try {
        const coupon = await CouponModel.create(req.body)
        res.status(201).send({ message: 'Vehicle add successfully!', coupon })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> saveReferral', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

const getReferral = async (req, res) => {
    try {
        const coupons = await CouponModel.find().lean();
        res.status(200).send({ coupons })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getReferral', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

const updateReferral = async (req, res) => {
    try {
        await CouponModel.updateOne({ _id: req.params.id }, req.body)
        res.status(200).send({ message: 'Vehicle update successfully!' })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> updateReferral', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

const deleteReferral = async (req, res) => {
    try {
        await CouponModel.deleteOne({ _id: req.params.id })
        res.status(200).send({ message: 'Vehicle delete successfully!' })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> deleteReferral', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

const getReferralById = async (req, res) => {
    try {
        const coupon = await CouponModel.findOne({ _id: req.params.id })
        res.status(200).send({ coupon })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getReferralById', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

const getLeads = async (req, res) => {
    try {
        const leads = await RideModel.find({ rideStatus: "none" },
            { _id: 1, name: 1, pickupDate: 1, createdOn: 1, isConnected: 1, bookingNo: 1 }
        ).populate('userId', 'primaryPhone email').populate('pickUpCity', 'name').populate('dropCity', 'name').sort({ createdOn: -1 });
        res.status(200).send({ leads })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getLeads', { error: error })
        res.status(500).send({ message: 'Server Error' })
    }
}

const confirmCall = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).send({ message: 'Invalid ID' });
        }
        await RideModel.updateOne({ _id: id }, { $set: { isConnected: true } });
        res.status(200).send({ message: 'Lead marked as called' });
    } catch (error) {
        logger.log('server/managers/admin.manager.js -> confirmCall', { error: error });
        res.status(500).send({ message: 'Server Error' });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find({ 'modules.userType': { $ne: 'ADMIN' } });
        res.status(200).json({ users });
    } catch (error) {
        logger.log('server/managers/admin.manager.js -> getUsers', { error: error });
        res.status(500).send({ message: 'Server Error' });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        res.status(200).json({ user });
    } catch (error) {
        logger.log('server/managers/admin.manager.js -> getUsers', { error: error });
        res.status(500).send({ message: 'Server Error' });
    }
}

const saveUser = async (req, res) => {
    try {
        const user = await UserModel.create(req.body)
        res.status(201).send({ message: 'User add successfully!', user })
    } catch (error) {
        logger.log('server/managers/admin.manager.js -> saveUser', { error: error });
        res.status(500).send({ message: 'Server Error' });
    }
}

const updateUser = async (req, res) => {
    try {
        await UserModel.updateOne({ _id: req.params.id }, req.body)
        res.status(200).send({ message: 'User update successfully!' })
    } catch (error) {
        logger.log('server/managers/admin.manager.js -> updateUser', { error: error });
        res.status(500).send({ message: 'Server Error' });
    }
}

const getVehicleByBookingType = async (req, res) => {
    try {
        const type = req?.params?.type;
        const vehicleList = await PricingModel.find({}, { vehicleType: 1, _id: 1 })
        let vehicle = []
        if (type === 'cityCab') {
            vehicle = vehicleList.filter(li => ['Hatchback', 'Sedan', 'SUV'].includes(li.vehicleType))
        } else {
            vehicle = vehicleList.filter(li => !['Hatchback'].includes(li.vehicleType))
        }

        res.status(200).send({ vehicleList: vehicle });
    } catch (error) {
        logger.log('server/managers/admin.manager.js -> getVehicleByBookingType', { error: error });
        res.status(500).send({ message: 'Server Error' });
    }
}

const confirmBooking = async (req, res) => {
    try {
        const id = req?.params?.id
        const body = req?.body

        const booking = await RideModel.findOne({ _id: id }, { paymentId: 1 }).populate('paymentId', 'dueAmount totalPrice payableAmount');

        const advancePercent = parseFloat(body?.advanceAmount) > 0 ? ((parseFloat(body?.advanceAmount) / booking?.paymentId?.payableAmount) * 100) : 0;
 
        await PaymentModel.updateOne({ _id: booking.paymentId?._id }, {
            advancePercent: roundToDecimalPlaces(advancePercent),
            dueAmount: booking?.paymentId?.dueAmount - parseFloat(body?.advanceAmount),
            isPayLater: parseFloat(body?.advanceAmount) > 0 ? false : true,
            isAdvancePaymentCompleted: parseFloat(body?.advanceAmount) > 0 ? true : false
        })
        await RideModel.updateOne({ _id: id }, {
            rideStatus: 'booked'
        })

        bookigSchedule(id)
        res.status(200).send({ message: 'Booking Confirm!'});
    } catch (error) {
        logger.log('server/managers/admin.manager.js -> confirmBooking', { error: error });
        res.status(500).send({ message: 'Server Error' });
    }
}

const downloadUsersCSV = async (req, res) => {
    try {
        const users = await UserModel.find({ 'modules.userType': { $ne: 'ADMIN' } });
        const headers = [
            JSON.stringify({ id: 'name', title: 'Name' }),
            JSON.stringify({ id: 'primaryPhone', title: 'Primary Phone' }),
            JSON.stringify({ id: 'email', title: 'Email' }),
        ];

        const filePath = await createCSVFile(headers, users);
        res.download(filePath, 'users.csv', (err) => {
            if (err) {
                console.error("Error sending file:", err);
                res.status(500).send('Error downloading file');
            }
        });
    } catch (error) {
        console.error("Error downloading CSV:", error);
        res.status(500).send('Error generating CSV');
    }
};

const getRecentNotification = async (req, res) => {
    try {
        const { skip, limit } = req.query
        const notification = await NotificationModel.find({ userId: req.user._id }).sort({ createdOn: -1 }).skip(Number(skip)).limit(Number(limit))
        // console.log(notification)
        res.status(200).send({ notification })
    } catch (error) {
        console.error("Error downloading CSV:", error);
        res.status(500).send('Error generating CSV');
    }
}



const generateFinalInvoice = async (req, res) => {
    try {
        const rideId = req?.body?.id
        delete req?.body?.id
        const body = req?.body
        const ride = await RideModel.aggregate([{
            $match: { _id: new ObjectId(rideId) }
        },
        {
            $lookup: {
                from: 'payments',
                localField: 'paymentId',
                foreignField: '_id',
                as: 'payments'
            }
        },
        {
            $unwind: {
                path: '$payments',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'prices',
                localField: 'vehicleId',
                foreignField: '_id',
                as: 'vehiclePrice'
            }
        },
        {
            $unwind: {
                path: '$vehiclePrice',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: 'cities',
                localField: 'pickUpCity',
                foreignField: '_id',
                as: 'city'
            }
        },
        {
            $unwind: {
                path: '$city',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                name: 1,
                pickupDate: 1,
                pickupTime: 1,
                dropDate: 1,
                totalPrice: 1,
                totalDistance: 1,
                isInvoiceGenerate: 1,
                payments: '$payments',
                trip: 1,
                rideStatus: 1,
                reason: 1,
                isConnected: 1,
                vehiclePrice: '$vehiclePrice',
                cities: '$city'
            }
        }
        ])
        const rideInfo = ride[0]

        const oldData = {
            pickupDate: rideInfo?.pickupDate,
            pickupTime: rideInfo?.pickupTime,
            dropDate: rideInfo?.dropDate,
            totalPrice: rideInfo?.totalPrice,
            totalDistance: rideInfo?.totalDistance,
            isInvoiceGenerate: rideInfo?.isInvoiceGenerate,
            payments: rideInfo?.payments,
            trip: rideInfo?.trip,
            rideStatus: rideInfo?.rideStatus,
        }
        let extraAmount = 0
        let distance = parseFloat(body?.totalDistance) || 0
        let extraDistance = (distance - rideInfo?.totalDistance) || 0;
        let extraHour = null
        let extraDay = 0
        if ((extraDistance > 0) || (['hourly', 'roundTrip'].includes(rideInfo?.trip?.tripType))) {

            /**********************************************************************************************************/
            if (rideInfo?.trip?.tripType === 'oneWay') {
                let totalPrice = null
                let metroCityPrice = 1
                if (!rideInfo?.cities?.isMetroCity) metroCityPrice = 1.75
                let extra = 1
                if (rideInfo?.vehiclePrice?.vehicleType === 'Traveller') {
                    extra = 2
                }
                totalPrice = extraDistance * rideInfo?.vehiclePrice?.upToCostPerKm * metroCityPrice * extra;
                extraAmount = totalPrice
            } else if (rideInfo?.trip?.tripType === 'roundTrip') {
                /**********************************************************************************************************/

                let pickupDate = `${rideInfo.pickupDate.year}-${rideInfo.pickupDate.month.padStart(2, '0')}-${rideInfo.pickupDate.date.padStart(2, '0')}`
                let numberOfDay = dateDifference(pickupDate, body.newDropDate)
                let dropDate = `${rideInfo.dropDate.year}-${rideInfo.dropDate.month.padStart(2, '0')}-${rideInfo.dropDate.date.padStart(2, '0')}`
                let oldnumberOfDay = dateDifference(pickupDate, dropDate)
                extraDay = numberOfDay - oldnumberOfDay
                let totalPrice = 0
                let pricesAdd = 0
                if (extraDistance < 0) {
                    extraDistance = 0
                }
                if (extraDay > 0) {
                    if (numberOfDay > oldnumberOfDay) {
                        if (numberOfDay * 250 > rideInfo?.totalDistance)
                            pricesAdd = (numberOfDay - oldnumberOfDay) * rideInfo.vehicleId.driverAllowance
                        extraDistance = 300 * extraDay
                    }
                }
                totalPrice = extraDistance * rideInfo?.vehiclePrice?.upToCostPerKm + pricesAdd;
                extraAmount = totalPrice

            } else if (rideInfo?.trip?.tripType === 'cityCab') {
                /**********************************************************************************************************/

                let totalPrice = null
                const priceInfo = CITY_CAB_PRICE.find(info => info.max > extraDistance && info.min < extraDistance)


                if (['Sedan'].includes(rideInfo?.vehiclePrice.vehicleType)) {
                    totalPrice = priceInfo.sedan.perKm * extraDistance
                } else if (['Hatchback'].includes(rideInfo?.vehiclePrice.vehicleType)) {
                    totalPrice = priceInfo.hatchback.perKm * extraDistance
                } else {
                    totalPrice = priceInfo.suv.perKm * extraDistance
                }

                extraAmount = totalPrice
            } else if (rideInfo?.trip?.tripType === 'hourly') {
                /*****************************************************************************************************/
                let totalPrice = 0
                let hourlyData = rideInfo?.vehiclePrice?.hourly.find(hr => hr.type === rideInfo?.trip?.hourlyType)
                if (hourlyData) {
                    extraHour = (body?.totalHour ? parseFloat(body?.totalHour) : 0) - hourlyData?.hour

                    if (extraHour && extraHour > 0) {
                        totalPrice = extraHour * rideInfo?.vehiclePrice?.upToCostPerHour
                    }
                    if (extraDistance > 0)
                        totalPrice = totalPrice + (extraDistance * rideInfo?.vehiclePrice?.upToCostPerKm) || 0
                }
                extraAmount = totalPrice
            }

        } else {
            extraAmount = 0
        }

        let payableAmount = extraAmount + rideInfo?.payments?.payableAmount
        let dueAmount = extraAmount + rideInfo?.payments?.dueAmount
        console.log(extraAmount, extraDay, extraDistance)
        await incrementInvoiceNumber(rideInfo?.payments?._id)
        await PaymentModel.updateOne({ _id: rideInfo?.payments?._id }, {
            extraAmount: roundToDecimalPlaces(extraAmount, 2),
            payableAmount: roundToDecimalPlaces(payableAmount, 2),
            dueAmount: roundToDecimalPlaces(dueAmount, 2),
            extraAmount: roundToDecimalPlaces(extraAmount, 2),
            extraHour: extraHour,
            extraDistance: extraDistance,
            newDropDate: body?.newDropDate,
            extraDay: extraDay
        })
        await RideModel.updateOne({ _id: rideInfo?._id }, { $set: { rideStatus: 'completed', isInvoiceGenerate: true }, $push: { activity: oldData } })

        res.status(200).send({ message: 'Invoice publish successfully!', booking: { extraAmount: roundToDecimalPlaces(extraAmount, 2), isInvoiceGenerate: true, payableAmount, dueAmount } });
    } catch (error) {
        logger.log('server/managers/admin.manager.js -> generateFinalInvoice', { error: error, userId: req.userId });
        res.status(500).send({ message: 'Server Error' });
    }
}

const confirmFullPayment = async (req, res) => {
    try {
        const paymentId = req?.params?.paymentId

        await PaymentModel.updateOne({ _id: new ObjectId(paymentId) }, {
            $set: {
                isPaymentCompleted: true
            }
        })
        res.status(200).send({ message: 'Payment confirmation successfully!' });
    } catch (error) {
        logger.log('server/managers/admin.manager.js -> confirmFullPayment', { error: error, userId: req.userId });
        res.status(500).send({ message: 'Server Error' });
    }
}

module.exports = {
    saveVehiclePrice,
    getVehiclePrice,
    updateVehiclePrice,
    deleteVehiclePrice,
    getVehiclePriceById,

    saveVehicle,
    getVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicleById,

    getBookingInfo,
    saveBooking,

    savePackage,
    getPackage,
    updatePackage,
    deletePackage,
    getPackageById,
    getPackageInfo,

    getEnquirePackage,
    getEnquireContact,

    getReferralById,
    deleteReferral,
    updateReferral,
    getReferral,
    saveReferral,

    getLeads,
    confirmCall,

    getUsers,
    getUserById,
    saveUser,
    updateUser,
    downloadUsersCSV,


    getVehicleByBookingType,
    confirmBooking,
    getRecentNotification,
    generateFinalInvoice,

    confirmFullPayment

}