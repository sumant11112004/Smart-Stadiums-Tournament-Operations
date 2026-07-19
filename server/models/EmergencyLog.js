const mongoose = require('mongoose');

const emergencyLogSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['medical', 'fire', 'panic', 'lost_child', 'weather'],
      required: true,
      index: true, // Database index to speed up filter searches (Efficiency)
    },
    details: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: true,
    },
    responseTeam: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'resolved'],
      default: 'active',
      index: true, // Index to optimize active incident filters (Efficiency)
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to speed up sorting queries on recent emergency dispatches (Efficiency)
emergencyLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('EmergencyLog', emergencyLogSchema);
