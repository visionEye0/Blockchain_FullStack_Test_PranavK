// models/AvailablePolicy.js
const mongoose = require("mongoose");

const availablePolicySchema = new mongoose.Schema({
  crop_type: { type: String, required: true },
  coverage_amount: { type: Number, required: true },
  premium: { type: Number, required: true },
  duration_months: { type: Number, required: true },
  description: { type: String }
});

module.exports = mongoose.model("AvailablePolicy", availablePolicySchema);
