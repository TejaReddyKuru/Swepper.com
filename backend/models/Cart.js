const mongoose = require('mongoose');

const cartItemSchema = mongoose.Schema({
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true,
  },
  planName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  bhkType: {
    type: String,
    default: 'N/A',
  },
  frequency: {
    type: String,
    default: 'Monthly',
  },
});

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to calculate subtotal, tax, and total before saving
cartSchema.pre('save', function (next) {
  let subtotal = 0;
  this.items.forEach((item) => {
    subtotal += item.price * item.quantity;
  });
  this.subtotal = subtotal;
  this.tax = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST in India
  this.total = Math.round((subtotal + this.tax) * 100) / 100;
  next();
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
