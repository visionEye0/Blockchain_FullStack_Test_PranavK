const express = require('express');
const router = express.Router();
const Policy = require('../models/policy');
const { contract, account } = require('../web3/contract');

router.post('/policies', async (req, res) => {
  const { farmer_id, crop_type, coverage_amount, premium, expiration_date } = req.body;

  const tx = await contract.methods.mintPolicyNFT(
    farmer_id, crop_type, coverage_amount, premium, expiration_date
  ).send({ from: account.address, gas: 500000 });

  const tokenId = tx.events.Transfer.returnValues.tokenId;

  const policy = new Policy({
    farmer_id, crop_type, coverage_amount, premium, expiration_date,
    token_id: tokenId
  });
  await policy.save();
  res.json(policy);
});

router.get('/policies', async (req, res) => {
  const policies = await Policy.find({});
  res.json(policies);
});

router.post('/policies/:id/claim', async (req, res) => {
  const policy = await Policy.findById(req.params.id);
  await contract.methods.claimPolicy(policy.token_id).send({ from: account.address, gas: 300000 });
  policy.status = 'claimed';
  await policy.save();
  res.json(policy);
});

module.exports = router;
