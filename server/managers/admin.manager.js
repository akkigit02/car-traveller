const PricingModel = require('../models/pricing.model');
const VehicleModel = require('../models/vehicle.model');
const RideModel = require('../models/ride.model')
const PackageModel = require('../models/packages.model');
const EnquirePackage = require('../models/enquire.package.model');
const CouponModel = require('../models/coupon.model');
const UserModel = require('../models/user.model');
const { getTotalPrice } = require('../services/calculation.service');
const CitiesModel = require('../models/cities.model');
const NotificationModel = require('../models/notification.model')
const { createCSVFile } = require('../utils/csv.util');

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
        const query = req.query
        const bookings = await RideModel.find({ rideStatus: 'completed' }).populate('userId', 'primaryPhone').sort({ createdOn: -1 }).skip(parseInt(query.skip)).limit(parseInt(query.limit))
        res.status(200).send({ bookings })
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getBookingInfo', { error: error, userId: req?.userId })
        res.status(500).send({ message: 'Server Error' })
    }
}

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
        let rideInfo = {
            name: body?.name,
            userId: user._id,
            trip: {
                tripType: body?.bookingType,
                hourlyType: body?.hourlyType
            },
            rideStatus: "scheduled",
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
            totalPrice: booking?.totalPrice?.toFixed(2),
            payablePrice: booking?.totalPrice?.toFixed(2),
            totalDistance: booking?.distance
        }

        const info = await RideModel.create(rideInfo);
        res.status(201).send({ message: 'Booking created successfully', booking: info });
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
        const leads = await RideModel.find({ paymentStatus: "pending" },
            { _id: 1, name: 1, pickupDate: 1, createdOn: 1, isConnected: 1 }
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
        await RideModel.updateOne({ _id: id }, { isConnected: true });
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

        const booking = await RideModel.findOne({ _id: id }, { totalPrice: 1, payablePrice: 1 })

        const advancePercent = (body?.advanceAmount / booking?.payablePrice) * 100;
        await RideModel.updateOne({ _id: id }, {
            advancePercent: advancePercent?.toFixed(2),
            paymentStatus: advanced
        })
        res.status(200).send({ message: 'Booking Confirm!' });
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
    getRecentNotification

}