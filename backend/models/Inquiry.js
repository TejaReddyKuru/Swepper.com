const mongoose = require('mongoose');

const inquirySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    selectedPlan: {
      type: String,
      default: 'General Inquiry',
    },
    address: {
      type: String,
    },
    blockNumber: {
      type: String,
    },
    apartmentNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: ['new', 'contacted'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

const Inquiry = mongoose.model('Inquiry', inquirySchema);
module.exports = Inquiry;
