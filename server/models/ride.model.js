const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Ride schema
const rideSchema = new Schema({
  driverId: { type: Schema.type.ObjectId, ref: "user" },
  vehicleId: { type: Schema.type.ObjectId, ref: "vehicle" },
  passenger: {type: Schema.type.ObjectId, ref: "user"},
  pickupLocation: {
    type: String,
    required: true,
  },
  dropoffLocation: {
    type: String,
    required: true,
  },
  pickupDate: {
    date: { type: String },
    month: { type: String },
    year: { type: String },
    required: true,
  },
  pickupTime: {
    type: String,
    required: true,
  },
  dropDate: {
    date: { type: String },
    month: { type: String },
    year: { type: String },
  },
  price: {
    tollTax: {type: Number},
    basePrice: {type: Number},
    driverAllowance: {type: Number},
    otherAllowance: {type: Number}
  },
  totalDistance: {type: Number},
  isLaguageCarrier: {type: Boolean}, 
  status: {
    type: String,
    enum: ["scheduled", "inProgress", "completed", "cancelled"],
    default: null,
  },
});

// Create a model based on the schema
const Ride = mongoose.model("ride", rideSchema);

module.exports = Ride;
