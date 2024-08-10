const CitiesModel = require('../models/cities.model');
const RideModel = require('../models/booking.model')

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
const addBooking = async (req, res) =>{
    try {
        let bookingDetails = req.body
        bookingDetails.status = "completed"
        const booking = await RideModel.create(bookingDetails)
        return res.status(200).send({booking,message: 'Ride has been Booked'})     
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Something went wrong' })
    }
}
const getBooking = async(req, res) => {
    try {
        const booking = await RideModel.find().lean();
        res.status(200).send({booking})
    } catch (error) {
        console.log(error)
    }
}
const getBookingByPasssengerId = async(req, res) => {
    try {
        const passengerId = req.params.id
        const booking = await RideModel.find({passengerId}).lean();
        res.status(200).send({booking})
    } catch (error) {
        console.log(error)
    }
}
const cancelBooking = async (req, res) => {
    try {
        const rideId = req.params.id
        const ride = await RideModel.findOne({_id:rideId})

        if (!ride) {
            return res.status(404).send({ message: 'Ride not found' });
        }

        const { pickupDate, pickupTime, status } = ride;
        
        if (status === "cancelled") {
            return res.status(500 ).send({ message: 'Ride is Already Cancelled' });
        }

        const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);

        const currentTime = new Date();

        const timeDifference = (pickupDateTime - currentTime) / (1000 * 60);

        if (timeDifference < 90) {
            return res.status(400).send({ message: 'Ride can only be cancelled before 90 minutes of the pickup time' });
        }

        await RideModel.findOneAndUpdate({ _id: rideId },{ status: "cancelled" });
        return res.status(200).send({ message: 'Ride cancelled successfully' });

        
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Something went wrong' }) 
    }
}

module.exports = {
    getCities,
    getCars,
    addBooking,
    getBooking,
    getBookingByPasssengerId,
    cancelBooking

}