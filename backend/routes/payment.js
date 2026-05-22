const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const { protectUser } = require('../middleware/userAuth');

let razorpay = null;
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (keyId && keySecret && !keyId.startsWith('your-')) {
  try {
    razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    console.log('✅ Razorpay initialized successfully');
  } catch (error) {
    console.warn('⚠️ Razorpay initialization failed, falling back to simulated checkout:', error.message);
  }
} else {
  console.warn('⚠️ Razorpay credentials missing or dummy in backend/.env. Running in simulated checkout mode.');
}

// @desc    Initialize payment / create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private (User)
router.post('/create-order', protectUser, async (req, res) => {
  const { items, subtotal, tax, totalAmount, serviceDate, timeSlot, address } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Your cart is empty' });
  }

  try {
    // 2. Create the pending order record in MongoDB
    const order = new Order({
      user: req.user._id,
      items: items.map((item) => ({
        planName: item.planName,
        price: item.price,
        quantity: item.quantity || 1,
        detail: item.detail,
      })),
      subtotal,
      tax,
      totalAmount,
      paymentStatus: 'Pending',
      orderStatus: 'Placed',
      serviceDate: serviceDate || new Date(),
      timeSlot: timeSlot || 'Anytime',
      address: address || { addressLine1: 'N/A', city: 'N/A', pincode: 'N/A' },
    });

    if (razorpay) {
      // Real Razorpay integration
      const options = {
        amount: Math.round(cart.total * 100), // Razorpay accepts paise
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}`,
      };

      const razorpayOrder = await razorpay.orders.create(options);
      
      order.razorpayOrderId = razorpayOrder.id;
      await order.save();

      res.status(201).json({
        isSimulated: false,
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          key: keyId,
        },
        order,
      });
    } else {
      // Simulated checkout fallback
      const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 11)}`;
      order.razorpayOrderId = mockOrderId;
      await order.save();

      res.status(201).json({
        isSimulated: true,
        mockOrderId,
        order,
      });
    }
  } catch (error) {
    console.error('Error creating checkout order:', error);
    res.status(500).json({ message: 'Checkout initialization failed: ' + error.message });
  }
});

// @desc    Verify payment signature
// @route   POST /api/payment/verify
// @access  Private (User)
router.post('/verify', protectUser, async (req, res) => {
  const { 
    orderId, 
    isSimulated, 
    razorpay_payment_id, 
    razorpay_order_id, 
    razorpay_signature 
  } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (isSimulated) {
      // Verify simulated payment
      order.paymentStatus = 'Paid';
      order.paymentId = `pay_mock_${Math.random().toString(36).substring(2, 11)}`;
      await order.save();

      return res.json({ success: true, message: 'Simulated payment succeeded!', order });
    }

    // Real Razorpay signature verification
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment details for verification' });
    }

    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      order.paymentStatus = 'Paid';
      order.paymentId = razorpay_payment_id;
      order.razorpaySignature = razorpay_signature;
      await order.save();

      res.json({ success: true, message: 'Payment verified successfully!', order });
    } else {
      order.paymentStatus = 'Failed';
      await order.save();
      res.status(400).json({ message: 'Invalid payment signature. Verification failed.' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Verification failed: ' + error.message });
  }
});

module.exports = router;
