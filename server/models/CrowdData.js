const mongoose = require('mongoose');

const crowdDataSchema = mongoose.Schema(
  {
    zone: {
      type: String,
      required: true,
      unique: true,
    },
    density: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true,
    },
    queueTimeMinutes: {
      type: Number,
      required: true,
      default: 0,
    },
    suggestions: {
      type: String,
      default: '',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CrowdData', crowdDataSchema);
