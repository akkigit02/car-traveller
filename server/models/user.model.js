const mongoose = require('mongoose');
const userTypeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true },
    primaryPhone: { type: String, required: true },
    secondaryPhone: { type: String, },
    status: { type: String, required: true, enum: ['sent', 'verified'] },
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
        otp: { type: Schema.Types.String },
        type: { type: Schema.Types.String, enum: ['phone', 'email'] },
        expiresOn: { type: Schema.Types.Date },
        resetSessionId: { type: Schema.Types.String }
      },
      twoFactor: {
        enabled: { type: Boolean },
        otp: { type: Schema.Types.String },
        expiresOn: { type: Schema.Types.Date },
        sessionId: { type: Schema.Types.String }
      },
      loginSessionId: { type: Schema.Types.String },
    },
    logo: { type: Schema.Types.String },
  },
  { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } }
);

module.exports = mongoose.model('user', userTypeSchema);
