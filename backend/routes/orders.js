const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protectUser } = require('../middleware/userAuth');
const { protect } = require('../middleware/auth');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (User)
router.post('/', protectUser, async (req, res) => {
  const { items, subtotal, tax, totalAmount, serviceDate, timeSlot, address } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    const order = new Order({
      user: req.user._id,
      items,
      subtotal,
      tax,
      totalAmount,
      serviceDate: serviceDate || Date.now(), // fallback
      timeSlot: timeSlot || 'Anytime',
      address: address || { addressLine1: 'N/A', city: 'N/A', pincode: 'N/A' },
      paymentStatus: 'Paid', // Defaulting to paid for now as per plan
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get logged in user's order history
// @route   GET /api/orders/my
// @access  Private (User)
router.get('/my', protectUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all orders (admin only)
// @route   GET /api/orders
// @access  Private (Admin)
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Admin)
router.patch('/:id/status', protect, async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Toggle service eligibility
// @route   PATCH /api/admin/toggle-service/:id
// @access  Private (Admin)
router.patch('/toggle-service/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.serviceEligible = !order.serviceEligible;
    const updatedOrder = await order.save();
    res.json({ message: 'Service eligibility updated', serviceEligible: updatedOrder.serviceEligible });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
