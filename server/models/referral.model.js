const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const referralSchema = new Schema({
    name: { type: String },
    discount: {type: Number}
});

const ReferralCode = mongoose.model("referral-code", referralSchema);

module.exports = ReferralCode;

