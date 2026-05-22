const mongoose = require('mongoose');

const planSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true, // 'Basic', 'Premium', 'Customised'
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    features: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    bhkType: {
      type: String,
      default: 'N/A', // '1 BHK', '2 BHK', '3 BHK', 'N/A'
    },
    frequency: {
      type: String,
      default: 'Monthly', // 'Daily', 'Bi-weekly', 'Weekly', 'One-time'
    },
  },
  {
    timestamps: true,
  }
);

const Plan = mongoose.model('Plan', planSchema);
module.exports = Plan;
