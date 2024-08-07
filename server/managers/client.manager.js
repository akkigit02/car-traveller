const CityModel = require('../models/city.model');


const getCities = async (req, res) => {
    try {
        const search = req?.query?.search
        const cities = await CityModel.aggregate([
            {
                $match: {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { state_name: { $regex: search, $options: 'i' } }
                    ]
                }
            }, { $limit: 15 }
        ])
        return res.status(200).send({ cities })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message:'Something went wrong' })
    }
}
module.exports = {
    getCities,
}