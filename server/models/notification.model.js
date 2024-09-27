const mongoose = require("mongoose");
const BillingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    title: { type: String, required: true },
    type: { type: String, enum: ['NEW_BOOKING', 'NEW_LEAD','RESCHEDULED'] },
    data: { type: mongoose.Schema.Types.Mixed },
    isRead: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } });

module.exports = mongoose.model('notification', BillingSchema);
