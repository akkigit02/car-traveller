const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PaymentSchema = new mongoose.Schema({
    paymentId: { type: String, unique: true }, 
    merchantTransactionId: { type: String, unique: true }, // Unique transaction ID per PhonePe's requirement
    merchantUserId: String, // User ID in your system
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    amount: Number, // Amount in paisa
    currency: { type: String, default: 'INR' },
    productInfo: String, // Information about the product or order
    redirectUrl: String, // URL to redirect the user after payment
    callbackUrl: String, // URL for PhonePe to send payment status updates
    paymentInstrument: {
        type: String, // e.g., 'UPI', 'CARD', 'NETBANKING'
        reference: String, // e.g., UPI VPA, Card number (ensure compliance with PCI-DSS if storing card details)
    },
    request: mongoose.Schema.Types.Mixed, // Request data sent to PhonePe
    response: mongoose.Schema.Types.Mixed, // Response data received from PhonePe
    status: {
        type: String,
        enum: ['CREATED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'REFUNDED'],
        default: 'CREATED',
    },
    paymentState: String, // Specific payment state returned by PhonePe
    responseCode: String, // Response code from PhonePe
    responseMessage: String, // Response message from PhonePe
    gatewayTransactionId: String, // Transaction ID from PhonePe
    gatewayResponse: mongoose.Schema.Types.Mixed, // Full response data from PhonePe
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', PaymentSchema);
