const PricingModel = require('../models/pricing.model')


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

// router.put('/vehicle-price',AdminManager.updateVehiclePrice)
// router.delete('/vehicle-price/:id',AdminManager.deleteVehiclePrice)
// router.get('/vehicle-price/:id',AdminManager.getVehiclePriceById)

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


module.exports = {
    saveVehiclePrice,
    getVehiclePrice,
    updateVehiclePrice,
    deleteVehiclePrice,
    getVehiclePriceById

}