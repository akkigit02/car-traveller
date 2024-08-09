const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CitiesSchema = new Schema({
    name: { type: String },
    state_name: { type: String },
    country_name: { type: String },
    latitude: { type: String },
    longitude: { type: String },
    isActive: { type: Boolean },
    isMetroCity: { type: Boolean }
});
CitiesSchema.index({ state_name: 1 });
CitiesSchema.index({ name: 1 });

const Cities = mongoose.model("cities", CitiesSchema);

module.exports = Cities;

