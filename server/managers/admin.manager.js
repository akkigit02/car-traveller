const PricingModel = require('../models/pricing.model');
const VehicleModel = require('../models/vehicle.model');
const RideModel = require('../models/ride.model')
const PackageModel = require('../models/packages.model');
const EnquirePackage = require('../models/enquire.package.model');
const CouponModel = require('../models/coupon.model');
const UserModel = require('../models/user.model');


const saveVehiclePrice = async(req, res) => {
    try {
        const price = await PricingModel.create(req.body)
        res.status(201).send({message: 'Vehicle price add successfully!', price})
    } catch (error) {  
      logger.log('server/managers/admin.manager.js-> saveVehiclePrice', {error: error})
      res.status(500).send({ message: 'Server Error' })
    }
}

const getVehiclePrice = async(req, res) => {
    try {
        const price = await PricingModel.find().lean();
        res.status(200).send({price})
    } catch (error) {
      logger.log('server/managers/admin.manager.js-> getVehiclePrice', {error: error})
      res.status(500).send({ message: 'Server Error' })
    }
}

const updateVehiclePrice = async(req, res) => {
    try {
        await PricingModel.updateOne({_id: req.body._id}, req.body)
        res.status(200).send({message: 'Vehicle price update successfully!'})
    } catch (error) {
      logger.log('server/managers/admin.manager.js-> updateVehiclePrice', {error: error})
      res.status(500).send({ message: 'Server Error' })
    }
}

const deleteVehiclePrice = async(req, res) => {
    try {
        await PricingModel.deleteOne({_id: req.params.id})
        res.status(200).send({message: 'Vehicle price delete successfully!'})
    } catch (error) {
      logger.log('server/managers/admin.manager.js-> deleteVehiclePrice', {error: error})
      res.status(500).send({ message: 'Server Error' })
    }
}

const getVehiclePriceById = async(req, res) => {
    try {
       const price = await PricingModel.findOne({_id: req.params.id})
        res.status(200).send({price})
    } catch (error) {
      logger.log('server/managers/admin.manager.js-> getVehiclePriceById', {error: error})
      res.status(500).send({ message: 'Server Error' })
    }
}
/*********************************Vehicle Detail***********************************************************/
const saveVehicle = async(req, res) => {
    try {
        const price = await VehicleModel.create(req.body)
        res.status(201).send({message: 'Vehicle add successfully!', price})
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> saveVehicle', {error: error})
        res.status(500).send({ message: 'Server Error' })  
    }
}

const getVehicle = async(req, res) => {
    try {
        const price = await VehicleModel.find().lean();
        res.status(200).send({price})
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getVehicle', {error: error})
        res.status(500).send({ message: 'Server Error' })
    }
}

const updateVehicle = async(req, res) => {
    try {
        await VehicleModel.updateOne({_id: req.body._id}, req.body)
        res.status(200).send({message: 'Vehicle update successfully!'})
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> updateVehicle', {error: error})
        res.status(500).send({ message: 'Server Error' })
    }
}

const deleteVehicle = async(req, res) => {
    try {
        await VehicleModel.deleteOne({_id: req.params.id})
        res.status(200).send({message: 'Vehicle delete successfully!'})
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> deleteVehicle', {error: error})
        res.status(500).send({ message: 'Server Error' })
    }
}

const getVehicleById = async(req, res) => {
    try {
       const price = await VehicleModel.findOne({_id: req.params.id})
        res.status(200).send({price})
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getVehicleById', {error: error})
        res.status(500).send({ message: 'Server Error' })
    }
}

const getBookingInfo = async (req,res) => {
    try {
        const bookings = await RideModel.find({}).populate('userId','primaryPhone')
        res.status(200).send({bookings})
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getBookingInfo', {error: error})
        res.status(500).send({ message: 'Server Error' })
    }
}

const saveBooking = async (req, res) => {
    try {
        console.log(req.body)
        const { name,primaryPhone,} = req.body;
        const rideInfo = req.body;
        let user = await UserModel.findOne({ primaryPhone});
        if (!user) {
            user = await UserModel.create({name,primaryPhone,modules: {userType: "CLIENT"} })  
        }
        rideInfo.userId = user._id
        rideInfo.trip ={
            tripType: req.body.bookingType,
          },
        rideInfo.bookingStatus = "completed",
        rideInfo.rideStatus = "scheduled"
        rideInfo.pickupDate=  {
            date: new Date(req.body?.bookingDate).getDate(),
            month: new Date(req.body?.bookingDate).getMonth()+1,
            year: new Date(req.body?.bookingDate).getFullYear(),
          }
        const booking = await RideModel.create(rideInfo);
        res.status(201).send({ message: 'Booking created successfully', booking });
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> saveBooking', { error: error });
        res.status(500).send({ message: 'Server Error' });
    }
};


/*********************************Package Detail***********************************************************/
const savePackage = async(req, res) => {
    try {
        const package = await PackageModel.create(req.body)
        res.status(201).send({message: 'Package add successfully!', package})
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> savePackage', {error: error})
        res.status(500).send({ message: 'Server Error' })  
    }
}

const getPackage = async(req, res) => {
    try {
        const package = await PackageModel.find().lean();
        res.status(200).send({package})
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getPackage', {error: error})
        res.status(500).send({ message: 'Server Error' })
    }
}

const updatePackage = async(req, res) => {
    try {
        await PackageModel.updateOne({_id: req.body._id}, req.body)
        res.status(200).send({message: 'Package update successfully!'})
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> updatePackage', {error: error})
        res.status(500).send({ message: 'Server Error' })
    }
}

const deletePackage = async(req, res) => {
    try {
        await PackageModel.deleteOne({_id: req.params.id})
        res.status(200).send({message: 'Package delete successfully!'})
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> deletePackage', {error: error})
        res.status(500).send({ message: 'Server Error' })
    }
}

const getPackageById = async(req, res) => {
    try {
       const package = await PackageModel.findOne({_id: req.params.id})
        res.status(200).send({package})
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getPackageById', {error: error})
        res.status(500).send({ message: 'Server Error' })
    }
}

const getPackageInfo = async () => {
    try {
        const ride = await RideModel.find({}).populate('passengerId','firstName lastName')
        res.status(200).send({ride})
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getPackageInfo', {error: error})
        res.status(500).send({ message: 'Server Error' })
    }
}

const getEnquirePackage = async (req, res) => {
    try {
        const packages = await EnquirePackage.find({})
        res.status(200).send({packages})
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getEnquirePackage', {error: error})
        res.status(500).send({ message: 'Server Error' })
    }
}

/*****************************Referral Code***************************************/

const saveReferral = async(req, res) => {
    try {
        const coupon = await CouponModel.create(req.body)
        res.status(201).send({message: 'Vehicle add successfully!', coupon})
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> saveReferral', {error: error})
        res.status(500).send({ message: 'Server Error' })  
    }
}

const getReferral = async(req, res) => {
    try {
        const coupons = await CouponModel.find().lean();
        res.status(200).send({coupons})
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getReferral', {error: error})
        res.status(500).send({ message: 'Server Error' })
    }
}

const updateReferral = async(req, res) => {
    try {
        await CouponModel.updateOne({_id: req.params.id}, req.body)
        res.status(200).send({message: 'Vehicle update successfully!'})
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> updateReferral', {error: error})
        res.status(500).send({ message: 'Server Error' })
    }
}

const deleteReferral = async(req, res) => {
    try {
        await CouponModel.deleteOne({_id: req.params.id})
        res.status(200).send({message: 'Vehicle delete successfully!'})
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> deleteReferral', {error: error})
        res.status(500).send({ message: 'Server Error' })
    }
}

const getReferralById = async(req, res) => {
    try {
       const coupon = await CouponModel.findOne({_id: req.params.id})
        res.status(200).send({coupon})
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getReferralById', {error: error})
        res.status(500).send({ message: 'Server Error' })
    }
}

const getLeads = async(req,res) =>{
    try {
        const leads = await RideModel.find({ paymentStatus: "pending" },
            { name: 1,pickupDate: 1,createdOn: 1}
          ).populate('userId', 'primaryPhone email').populate('pickUpCity','name').populate('dropCity','name').sort({ createdOn: -1 });
        res.status(200).send({leads})   
    } catch (error) {
       logger.log('server/managers/admin.manager.js-> getLeads', {error: error})
       res.status(500).send({ message: 'Server Error' })  
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
    
    getLeads

}