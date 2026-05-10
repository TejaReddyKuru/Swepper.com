const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      res.json({
        _id: admin._id,
        email: admin.email,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
