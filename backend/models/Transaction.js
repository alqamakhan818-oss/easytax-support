const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      default: null,
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: ['income', 'expense'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be greater than or equal to 0'],
    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, 'Date is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient sorting and filtering
transactionSchema.index({ type: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
