const mongoose = require('mongoose');

const documentItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Business Documents', 'Financial Documents', 'Tax Documents'],
      default: 'Business Documents',
    },
    status: {
      type: String,
      enum: ['Available', 'Missing'],
      default: 'Missing',
    },
    description: {
      type: String,
      default: '',
    },
  },
  { _id: true }
);

const documentStatusSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      default: null,
    },
    documents: [documentItemSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DocumentStatus', documentStatusSchema);
