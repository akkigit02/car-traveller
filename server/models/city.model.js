const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CitySchema = new Schema({
    name: { type: String },
    state_name: { type: String },
    country_name: { type: String },
    latitude: { type: String },
    longitude: { type: String },
    isActive: { type: Boolean }
});
CitySchema.index({ state_name: 1 });
CitySchema.index({ name: 1 });

const City = mongoose.model("city", CitySchema);

module.exports = City;

// $match: {
//     $or: [
//         { name: { $regex: nameRegex, $options: 'i' } },
//         { state_name: { $regex: stateNameRegex, $options: 'i' } }
//     ]
