const mongoose = require('mongoose');
const { Schema } = mongoose;

const ratingSchema = new Schema({
  rating: { type: Number, required: true },
  message: { type: String, required: false },
  ratedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ratedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
