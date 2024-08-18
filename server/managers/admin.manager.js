const PricingModel = require('../models/pricing.model');
const VehicleModel = require('../models/vehicle.model');
const RideModel = require('../models/ride.model')
const PackageModel = require('../models/packages.model')


const saveVehiclePrice = async(req, res) => {
    try {
        const price = await PricingModel.create(req.body)
        res.status(201).send({message: 'Vehicle price add successfully!', price})
    } catch (error) {
      console.log(error);  
    }
}

const getVehiclePrice = async(req, res) => {
    try {
        const price = await PricingModel.find().lean();
        res.status(200).send({price})
    } catch (error) {
        console.log(error)
    }
}

const updateVehiclePrice = async(req, res) => {
    try {
        await PricingModel.updateOne({_id: req.body._id}, req.body)
        res.status(200).send({message: 'Vehicle price update successfully!'})
    } catch (error) {
        console.log(error)
    }
}

const deleteVehiclePrice = async(req, res) => {
    try {
        await PricingModel.deleteOne({_id: req.params.id})
        res.status(200).send({message: 'Vehicle price delete successfully!'})
    } catch (error) {
        console.log(error)
    }
}

const getVehiclePriceById = async(req, res) => {
    try {
       const price = await PricingModel.findOne({_id: req.params.id})
        res.status(200).send({price})
    } catch (error) {
        console.log(error)
    }
}
/*********************************Vehicle Detail***********************************************************/
const saveVehicle = async(req, res) => {
    try {
        const price = await VehicleModel.create(req.body)
        res.status(201).send({message: 'Vehicle add successfully!', price})
    } catch (error) {
      console.log(error);  
    }
}

const getVehicle = async(req, res) => {
    try {
        const price = await VehicleModel.find().lean();
        res.status(200).send({price})
    } catch (error) {
        console.log(error)
    }
}

const updateVehicle = async(req, res) => {
    try {
        await VehicleModel.updateOne({_id: req.body._id}, req.body)
        res.status(200).send({message: 'Vehicle update successfully!'})
    } catch (error) {
        console.log(error)
    }
}

const deleteVehicle = async(req, res) => {
    try {
        await VehicleModel.deleteOne({_id: req.params.id})
        res.status(200).send({message: 'Vehicle delete successfully!'})
    } catch (error) {
        console.log(error)
    }
}

const getVehicleById = async(req, res) => {
    try {
       const price = await VehicleModel.findOne({_id: req.params.id})
        res.status(200).send({price})
    } catch (error) {
        console.log(error)
    }
}

const getBookingInfo = async (req,res) => {
    try {
        const ride = await RideModel.find({}).populate('passengerId','firstName lastName')
        res.status(200).send({ride})
    } catch (error) {
        console.log(error)
    }
}

/*********************************Package Detail***********************************************************/
const savePackage = async(req, res) => {
    try {
        const package = await PackageModel.create(req.body)
        res.status(201).send({message: 'Package add successfully!', package})
    } catch (error) {
      console.log(error);  
    }
}

const getPackage = async(req, res) => {
    try {
        const package = await PackageModel.find().lean();
        res.status(200).send({package})
    } catch (error) {
        console.log(error)
    }
}

const updatePackage = async(req, res) => {
    try {
        await PackageModel.updateOne({_id: req.body._id}, req.body)
        res.status(200).send({message: 'Package update successfully!'})
    } catch (error) {
        console.log(error)
    }
}

const deletePackage = async(req, res) => {
    try {
        await PackageModel.deleteOne({_id: req.params.id})
        res.status(200).send({message: 'Package delete successfully!'})
    } catch (error) {
        console.log(error)
    }
}

const getPackageById = async(req, res) => {
    try {
       const package = await PackageModel.findOne({_id: req.params.id})
        res.status(200).send({package})
    } catch (error) {
        console.log(error)
    }
}

const getPackageInfo = async () => {
    try {
        const ride = await RideModel.find({}).populate('passengerId','firstName lastName')
        res.status(200).send({ride})
    } catch (error) {
        console.log(error)
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
    getPackageInfo
}