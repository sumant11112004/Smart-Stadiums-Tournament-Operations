const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true // Implicit index (Efficiency)
  },
  userId: {
    type: String,
    required: true,
    index: true // Database index to speed up validation checks (Efficiency)
  },
  expiryDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });

// TTL index to automatically prune expired tokens from database after 30 days (Efficiency)
RefreshTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
