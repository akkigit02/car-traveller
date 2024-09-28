const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'ride' },
    totalPrice: { type: Number },
    couponCode: { type: String },
    totalDistance: { type: Number },
    advancePercent: { type: Number },
    payableAmount: { type: Number },
    extraAmount: {type: Number},
    dueAmount: { type: Number },
    isPayLater: { type: Boolean },
    invoiceNo: { type: String },
    isAdvancePaymentCompleted: { type: Boolean },
    isPaymentCompleted: { type: Boolean },
    comments: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updateBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } });

module.exports = mongoose.model('payment', paymentSchema);
