const mongoose = require('mongoose');


const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, trim: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    maxDiscountAmount: { type: Number },
    minPurchaseAmount: { type: Number },
    startDate: { type: Date },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usedUser: [{ type: mongoose.Types.ObjectId }],
    userCondition: [{ type: mongoose.Schema.Types.Mixed }]
}, { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } });

module.exports = mongoose.model('Coupon', couponSchema);
