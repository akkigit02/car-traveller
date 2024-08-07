const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Define the Ride schema
const rideSchema = new mongoose.Schema({
  driverId: { type: ObjectId, ref: "user" },
  vehicleId: { type: ObjectId, ref: "vehicle" },
  passengerId: {type: ObjectId, ref: "user"},
  pickupLocation: {
    type: String,
    required: true,
  },
  dropoffLocation: {
    type: String,
    required: true,
  },
  pickupDate: {
    date: { type: String,required: true, },
    month: { type: String,required: true, },
    year: { type: String,required: true, },
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
  totalPrice: {type: String },
  advancePayment: {type: String},
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
