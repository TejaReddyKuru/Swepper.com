const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');

// @desc    Get all active subscription/service plans
// @route   GET /api/plans
// @access  Public
router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
