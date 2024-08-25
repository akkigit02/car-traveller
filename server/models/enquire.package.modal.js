const mongoose = require('mongoose');
const { Schema } = mongoose;

const packageSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  package: { type: String, required: true },
  date: { type: String, required: true },
}, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt` fields

const enquirePackage = mongoose.model('enquire-package', packageSchema);

module.exports = enquirePackage;
