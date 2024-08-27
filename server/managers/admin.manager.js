const PricingModel = require('../models/pricing.model');
const VehicleModel = require('../models/vehicle.model');
const RideModel = require('../models/ride.model')
const PackageModel = require('../models/packages.model');
const EnquirePackage = require('../models/enquire.package.model')


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
        const ride = await RideModel.find({}).populate('passengerId','firstName lastName')
        res.status(200).send({ride})
    } catch (error) {
        logger.log('server/managers/admin.manager.js-> getBookingInfo', {error: error})
        res.status(500).send({ message: 'Server Error' })
    }
}

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

    savePackage,
    getPackage,
    updatePackage,
    deletePackage,
    getPackageById,
    getPackageInfo,

    getEnquirePackage
}