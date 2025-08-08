const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  farmer_id: String,
  crop_type: String,
  coverage_amount: Number,
  premium: Number,
  expiration_date: Number,
  status: { type: String, enum: ['active', 'claimed'], default: 'active' },
  token_id: Number
});

module.exports = mongoose.model('Policy', policySchema);
