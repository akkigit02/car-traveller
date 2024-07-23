const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({
  color: { type: String },
  registrationDate: {
    date: { type: String },
    month: { type: String },
    year: { type: String }
  },
  capacity: {
    numberOfSeat: { type: Number },
    luggage: { type: String },
    description: { type: String }, // 2 back or 3 back
  },
  fuelType: { type: String, required: true },
  type: { type: String },
  mileage: { type: Number }, // kmph,
  modelName: { type: String, required: true },
  manufacturerName: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  VIN: { type: String, required: true }, // chassis number,
  registrationCertificate: { type: String },
  insurance: [{
    policyNumber: { type: String, required: true },
    expiryDate: { type: String, required: true },
    documentPath: { type: String, required: true },
  }],
  owner: {

  }
});
module.exports = mongoose.model('vehicle', vehicleSchema);
