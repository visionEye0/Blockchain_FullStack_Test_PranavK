const express = require('express');
const router = express.Router();
const Policy = require('../models/policy');

router.post('/policies', async (req, res) => {
  const { farmer_id, crop_type, coverage_amount, premium, expiration_date, token_id } = req.body;

  const policy = new Policy({
    farmer_id, crop_type, coverage_amount, premium, expiration_date, token_id, status: 'active'
  });
  await policy.save();
  
  res.status(201).json(policy)
});

router.get('/policies', async (req, res) => {
  const policies = await Policy.find({});
  res.json(policies);
});

router.post('/policies/:id/claim', async (req, res) => {
  const policy = await Policy.findById(req.params.id);
  if (!policy) return res.status(404).json({ error: 'Policy not found' });
  
  policy.status = 'claimed';
  
  await policy.save();
  
  res.json(policy);

});

module.exports = router;
