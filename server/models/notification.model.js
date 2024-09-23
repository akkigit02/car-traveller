const mongoose = require("mongoose");
const BillingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['booking_confirmation', 'booking_cancellation', 'ride_reminder', 'promotional_offer', 'system_alert'] },
    data: { type: mongoose.Schema.Types.Mixed },
    isRead: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } });

module.exports = mongoose.model('billing', BillingSchema);
