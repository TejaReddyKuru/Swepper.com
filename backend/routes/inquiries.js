const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { protect } = require('../middleware/auth');

// @desc    Create an inquiry
// @route   POST /api/inquiries
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, phone, message, selectedPlan } = req.body;
    const inquiry = await Inquiry.create({
      name,
      phone,
      message,
      selectedPlan,
    });
    res.status(201).json(inquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private (Admin)
router.get('/', protect, async (req, res) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id
// @access  Private (Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (inquiry) {
      inquiry.status = req.body.status || inquiry.status;
      const updatedInquiry = await inquiry.save();
      res.json(updatedInquiry);
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete an inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (inquiry) {
      await inquiry.deleteOne();
      res.json({ message: 'Inquiry removed' });
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
