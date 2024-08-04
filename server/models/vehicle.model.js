const mongoose = require("mongoose");
const vehicleSchema = new mongoose.Schema({
  color: { type: String },
  registrationDate: {
    date: { type: String },
    month: { type: String },
    year: { type: String },
  },
  capacity: {
    numberOfSeat: { type: Number },
    laguage: { type: String },
    description: { type: String }, // 2 back or 3 back
  },
  fuelType: { type: String, enum: ['petrol', 'diesel', 'cng'] },
  type: { type: String },
  mileage: { type: Number }, // kmph,
  status: {type: String, enum: ['available', 'rented', 'under_maintenance']},
  modelName: { type: String },
  manufacturerName: { type: String},
  registrationNumber: { type: String },
  VIN: { type: String }, // chassis number,
  registrationCertificate: { type: String },
  insurance:{
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
