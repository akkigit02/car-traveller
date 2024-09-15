const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  color: { type: String },
  registrationDate: {type:Date},
  capacity: {
    totalNumberOfSeats: { type: Number },
    reservedNumberOfSeats: { type: Number }, // for diver and helper
    luggage: { type: String }, // Corrected "laguage" to "luggage"
    description: { type: String }, // 2 back or 3 back
  },
  fuelType: { type: String, enum: ['petrol', 'diesel', 'cng',"electric"] },
  type: { type: String },
  mileage: { type: Number }, // kmpl 
  numberOfSeat:{type: Number},
  laguage:{type:Boolean,default: false},
  rentalRatePerKm: { type: Number }, // per kilometer
  driverAllowance: { type: Number }, //  per day
  status: { type: String, enum: ['available', 'rented', 'under_maintenance'] },
  modelName: { type: String },
  manufacturerName: { type: String },
  registrationNumber: { type: String },
  VIN: { type: String }, // Vehicle Identification Number (chassis number)
  registrationCertificate: { type: String },
  puc:{type:Date},
  insuranceExpiryDate:{type:Date},
  roadTax:{type:Date},
  owner: {
    firstName: { type: String },
    lastName: { type: String },
  },
});

module.exports = mongoose.model("vehicle", vehicleSchema); 
