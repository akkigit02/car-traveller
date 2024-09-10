const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;

// Define the Ride schema
const rideSchema = new Schema({
  name: { type: String },
  driverId: { type: Schema.Types.ObjectId, ref: "user" },
  vehicleId: { type: Schema.Types.ObjectId, ref: "price" },
  userId: { type: Schema.Types.ObjectId, ref: "user" },
  pickUpCity: { type: Schema.Types.ObjectId, ref: "cities" },
  dropCity: [{ type: Schema.Types.ObjectId, ref: "cities" }],
  pickupLocation: {
    type: String,
    required: true,
  },
  dropoffLocation: {
    type: String,
  },
  pickupDate: {
    date: { type: String, required: true },
    month: { type: String, required: true },
    year: { type: String, required: true },
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
  totalPrice: { type: Number },
  advancePercent: { type: String },
  couponCode: { type: String },
  totalDistance: { type: Number },
  trip: {
    tripType: { type: String },
    hourlyType: { type: String }
  },
  isLaguageCarrier: { type: Boolean },
  paymentStatus: { type: String, enum: ["pending","advanced", "completed"], default: 'pending' },
  rideStatus: {
    type: String,
    enum: ["none", "scheduled", "inProgress", "completed", "cancelled",'resheduled'],
    default: 'none',
  },
  isconnected: { type: Boolean, default: false },
  activity: [{type: Schema.Types.Mixed}]
},{ timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } });

// Create a model based on the schema
const Ride = mongoose.model("ride", rideSchema);

module.exports = Ride;