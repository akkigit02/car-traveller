const mongoose = require("mongoose");
const BillingSchema = new mongoose.Schema({
    paymentId: { type: String },
    paymentType: { type: String, enum: ['advanced', 'full'] },
    isPayOffine: { type: Boolean, default: false },
    merchantTransactionId: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'ride' },
    amount: Number, // Amount in paisa
    currency: { type: String, default: 'INR' },
    paymentUrl: { type: String },
    paymentState: { type: String, enum: ['PAYMENT_INITIATED', 'PAYMENT_SUCCESS', 'FAILED', 'REFUNDED'] },
    paymentInstrument: { type: mongoose.Schema.Types.Mixed, },
    gatewayResponse: [{ type: mongoose.Schema.Types.Mixed }],

}, { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } });

module.exports = mongoose.model('billing', BillingSchema);
