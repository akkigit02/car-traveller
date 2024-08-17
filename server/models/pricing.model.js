const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Ride schema
const PricingSchema = new Schema({
  vehicleType: { type: String },
  vehicleName: {type: String},
  vehicleImageUrl: {type: String},
  upToKm: {type: Number},
  upToCostPerKm: {type: Number},
  upToCostPerHour: {type: Number},
  capacity: {
    totalNumberOfSeats: {type: Number}, // 4+1
    reservedNumberOfSeats: {type: Number},
    description: {type: String}
  },
  acAvailable: {type: Boolean},
  baseFare: { type: Number },
  costPerKm: { type: Number },
  costPerHour: { type: Number },
  laguageCarrierCost: { type: Number },
  minimumFare: { type: Number },
  additionalCharges: {type: Number},
  driverAllowance: {type: Number},
  similar: [{type: String}],
  hourly: [{
    type: {type: String},
    hour: { type: Number },
    distance: {type: Number},
    basePrice: { type: Number},
  }]
});

// Create a model based on the schema
const Price = mongoose.model("price", PricingSchema);

module.exports = Price;
