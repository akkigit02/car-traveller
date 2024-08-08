const CitiesModel = require('../models/cities.model');


const getCities = async (req, res) => {
    try {
        const search = req?.query?.search
        const cities = await CitiesModel.aggregate([
            {
                $addFields: { city_name: { $concat: ['$name', ', ', '$state_name'] } }
            },
            {
                $match: { city_name: { $regex: search, $options: 'i' } }
            }, { $limit: 15 }
        ])
        return res.status(200).send({ cities })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Something went wrong' })
    }
}
const getCars = async (req, res) => {
    try {
        const search = req?.query?.search
        const decodedString = atob(search);
        const decodedData = JSON.parse(decodedString);
        console.log(decodedData)
        
        return res.status(200).send({})
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Something went wrong' })
    }
}
module.exports = {
    getCities,
    getCars
}