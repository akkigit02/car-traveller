const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Ride schema
const PricingSchema = new Schema({
  vehicleType: { type: String },
  baseFare: { type: Number },
  costPerKm: { type: Number },
  costPerHour: { type: Number },
  laguageCarrierCost: { type: Number },
  minimumFare: { type: Number },
  additionalCharges: {type: Number},
});

// Create a model based on the schema
const Price = mongoose.model("price", PricingSchema);

module.exports = Price;
