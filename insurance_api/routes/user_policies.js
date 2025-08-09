const express = require('express');
const router = express.Router();
const Policy = require('../models/policy');

router.post('/policies', async (req, res) => {
  let { farmer_id, crop_type, coverage_amount, premium, expiration_date, token_id } = req.body;

  farmer_id = farmer_id.toLowerCase()
  const policy = new Policy({
    farmer_id, crop_type, coverage_amount, premium, expiration_date, token_id, status: 'active'
  });
  await policy.save();
  
  res.status(201).json(policy)
});

router.get('/policies/:farmer_id', async (req, res) => {
  const farmer_id = req.params.farmer_id.toLowerCase()
  const policies = await Policy.find({ farmer_id });
  res.json(policies);
});

router.post('/policies/claim', async (req, res) => {
  try {
    let { farmer_id, token_id } = req.body;

    farmer_id = farmer_id.toLowerCase()

    if (!farmer_id || token_id === undefined) {
      return res.status(400).json({ error: 'farmer_id and token_id are required' });
    }

    const policy = await Policy.findOne({ farmer_id, token_id });

    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }

    policy.status = 'claimed';
    await policy.save();

    res.json({ message: 'Policy claimed successfully', policy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
