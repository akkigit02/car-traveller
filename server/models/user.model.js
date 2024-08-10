const mongoose = require('mongoose');
const Schema = mongoose.Schema
const userTypeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true },
    primaryPhone: { type: String, required: true },
    secondaryPhone: { type: String, },
    dateOfBirth: {
      date: { type: String },
      month: { type: String },
      year: { type: String }
    },
    password: { type: String, default: null },
    modules: {
      userType: { type: String, emum: ['DEVELOPER', 'ADMIN', 'DRIVER', 'CLIENT'] },
      accessibleModule: [{ type: String }]
    },
    currentAddress: {
      addressLine: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String },
      county: { type: String, default: "" },
      zip: { type: String, default: '' },
    },
    permanentAddress: {
      addressLine: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String },
      county: { type: String, default: "" },
      zip: { type: String, default: '' },
    },
    authentication: {
      forgetOtp: {
        otp: { type: String },
        type: { type: String, enum: ['phone', 'email'] },
        expiresOn: { type: Date },
        resetSessionId: { type: String }
      },
      twoFactor: {
        enabled: { type: Boolean, default: true },
        otp: { type: String },
        expiresOn: { type: Date },
        sessionId: { type: String }
      },
      loginSessionId: { type: String },
    },
    logo: { type: String },
  },
  { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } }
);

module.exports = mongoose.model('user', userTypeSchema);
