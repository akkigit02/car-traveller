const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  color: { type: String },
  registrationDate: {
    date: { type: String },
    month: { type: String },
    year: { type: String },
  },
  capacity: {
    totalNumberOfSeats: { type: Number },
    reservedNumberOfSeats: { type: Number }, // for diver and helper
    luggage: { type: String }, // Corrected "laguage" to "luggage"
    description: { type: String }, // 2 back or 3 back
  },
  fuelType: { type: String, enum: ['petrol', 'diesel', 'cng'] },
  type: { type: String },
  mileage: { type: Number }, // kmpl 
  rentalRatePerKm: { type: Number }, // per kilometer
  driverAllowance: { type: Number }, //  per day
  status: { type: String, enum: ['available', 'rented', 'under_maintenance'] },
  modelName: { type: String },
  manufacturerName: { type: String },
  registrationNumber: { type: String },
  VIN: { type: String }, // Vehicle Identification Number (chassis number)
  registrationCertificate: { type: String },
  insurance: {
    policyNumber: { type: String },
    expiryDate: { type: String },
    documentPath: { type: String },
  },
  owner: {
    firstName: { type: String },
    lastName: { type: String },
  },
});

module.exports = mongoose.model("vehicle", vehicleSchema); 
