const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Plan = require('../models/Plan');
const { protectUser } = require('../middleware/userAuth');

// Helper to get or create cart
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }
  return cart;
};

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private (User)
router.get('/', protectUser, async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private (User)
router.post('/add', protectUser, async (req, res) => {
  const { planId, quantity = 1 } = req.body;

  try {
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const cart = await getOrCreateCart(req.user._id);

    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.planId.toString() === planId
    );

    if (itemIndex > -1) {
      // If it exists, update quantity
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      // Else, push new item
      cart.items.push({
        planId: plan._id,
        planName: plan.name,
        price: plan.price,
        quantity: Number(quantity),
        bhkType: plan.bhkType,
        frequency: plan.frequency,
      });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:planId
// @access  Private (User)
router.delete('/remove/:planId', protectUser, async (req, res) => {
  const { planId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Filter out item
    cart.items = cart.items.filter(
      (item) => item.planId.toString() !== planId
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Clear cart
// @route   POST /api/cart/clear
// @access  Private (User)
router.post('/clear', protectUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
