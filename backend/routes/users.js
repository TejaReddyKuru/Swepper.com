const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTPEmail } = require('../config/nodemailer');
const { protectUser } = require('../middleware/userAuth');
const { protect } = require('../middleware/auth');

// Helper to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register a new customer user (sends OTP)
// @route   POST /api/users/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, phone, addressLine1, city, pincode, landmark } = req.body;

  try {
    let user = await User.findOne({ email });
    
    let addresses = [];
    if (addressLine1 && city && pincode) {
      addresses = [{ addressLine1, city, pincode, landmark, isDefault: true }];
    }

    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: 'User already exists and is verified' });
      } else {
        // Reuse unverified user record, update details and send new OTP
        user.name = name;
        user.password = password;
        user.phone = phone;
        if (addresses.length > 0) user.addresses = addresses;
      }
    } else {
      // Create new user record
      user = new User({ name, email, password, phone, addresses });
    }

    // Generate and set OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Send the OTP via email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('SMTP Email Error:', emailError);
      return res.status(500).json({ 
        message: 'Could not send verification email. Please check that your email user and password are correct in .env.' 
      });
    }

    await user.save();
    res.status(201).json({ message: 'Registration initiated. OTP sent to email.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Verify OTP for user registration
// @route   POST /api/users/verify-otp
// @access  Public
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    // Validate OTP and expiration
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark as verified and clear OTP fields
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Create JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Resend OTP to email
// @route   POST /api/users/resend-otp
// @access  Public
router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    // Generate new OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('SMTP Email Error:', emailError);
      return res.status(500).json({ 
        message: 'Could not send verification email. Please check that your email user and password are correct in .env.' 
      });
    }

    await user.save();
    res.json({ message: 'New OTP sent to email.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Login customer & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ 
        message: 'Email not verified. Please register again to verify your email.',
        unverified: true 
      });
    }

    if (await user.matchPassword(password)) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token,
      });
    } else {
      res.status(400).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user profile details
// @route   GET /api/users/profile
// @access  Private (User)
router.get('/profile', protectUser, async (req, res) => {
  res.json(req.user);
});

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private (Admin)
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add a saved address
// @route   POST /api/users/address
// @access  Private (User)
router.post('/address', protectUser, async (req, res) => {
  const { addressLine1, city, pincode, landmark } = req.body;

  if (!addressLine1 || !city || !pincode) {
    return res.status(400).json({ message: 'Address, city, and pincode are required' });
  }

  try {
    const user = await User.findById(req.user._id);
    
    // If it's the first address, make it default
    const isDefault = user.addresses.length === 0;

    user.addresses.push({ addressLine1, city, pincode, landmark, isDefault });
    await user.save();
    
    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a saved address
// @route   DELETE /api/users/address/:id
// @access  Private (User)
router.delete('/address/:id', protectUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Set default address
// @route   PUT /api/users/address/:id/default
// @access  Private (User)
router.put('/address/:id/default', protectUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === req.params.id;
    });
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle service status for a user (30 days validity)
// @route   PATCH /api/users/:id/toggle-service
// @access  Private (Admin)
router.patch('/:id/toggle-service', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Toggle logic
    const newStatus = !user.serviceStatus;
    const newExpiry = newStatus ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          serviceStatus: newStatus,
          serviceExpiryDate: newExpiry
        }
      },
      { new: true }
    );

    res.json({
      message: updatedUser.serviceStatus ? 'Service activated for 30 days' : 'Service deactivated',
      serviceStatus: updatedUser.serviceStatus,
      serviceExpiryDate: updatedUser.serviceExpiryDate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
