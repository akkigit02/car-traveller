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
  fuelType: { type: String, required: true, enum: ['petrol', 'diesel', 'cng'] },
  type: { type: String },
  price: { type: Number }, // per km price
  mileage: { type: Number }, // kmph,
  status: {type: String, enum: ['available', 'rented', 'under_maintenance']},
  modelName: { type: String, required: true },
  manufacturerName: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  VIN: { type: String, required: true }, // chassis number,
  registrationCertificate: { type: String },
  insurance: [
    {
      policyNumber: { type: String, required: true },
      expiryDate: { type: String, required: true },
      documentPath: { type: String, required: true },
    },
  ],
  owner: {
    firstName: { type: String },
    lastName: { type: String },
  },
});
module.exports = mongoose.model("vehicle", vehicleSchema);
