const mongoose = require('mongoose');
const { Schema } = mongoose;

const packageSchema = new Schema({
  Name: { type: String, required: true },
  Description: { type: String, required: true },
  Category: { type: String, required: true },
  Duration: { type: String, required: true },
  Price: { type: Number, required: true },
  Discount: { type: Number, default: 0 }, // Default to 0 if no discount is applied
  Availability: { type: Date, required: true },
  Rating: { type: Number, min: 0, max: 5, default: 0 }, // Rating between 0 and 5
  ImageURL: { type: String, required: true }
}, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt` fields

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
