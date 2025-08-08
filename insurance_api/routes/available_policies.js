// routes/adminPolicies.js
const express = require("express");
const router = express.Router();
const AvailablePolicy = require("../models/AvailablePolicy");

// GET /available-policies
router.get("/", async (req, res) => {
  try {
    const policies = await AvailablePolicy.find();
    res.json(policies);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
