const mongoose = require('mongoose');

const emergencyLogSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['medical', 'fire', 'panic', 'lost_child', 'weather'],
      required: true,
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
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('EmergencyLog', emergencyLogSchema);
