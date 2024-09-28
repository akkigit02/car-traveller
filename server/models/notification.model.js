const mongoose = require("mongoose");
const BillingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    title: { type: String, required: true },
    type: { type: String, enum: ['NEW_BOOKING', 'NEW_LEAD','DUE_PAYMENT_RECEIVED','BOOKING_CANCEL','BOOKING_RESCHEDULED'] },
    data: { type: mongoose.Schema.Types.Mixed },
    isRead: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } });

module.exports = mongoose.model('notification', BillingSchema);
