const mongoose = require('mongoose');

const aiQuerySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for anonymous visitors
      index: true, // Database index to speed up user history queries (Efficiency)
    },
    category: {
      type: String,
      enum: ['assistant', 'companion', 'sustainability', 'general'],
      default: 'general',
      index: true, // Index for grouping category analytics (Efficiency)
    },
    query: {
      type: String,
      required: [true, 'Query text is required'],
    },
    response: {
      type: String,
      required: [true, 'AI response is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to speed up sorting queries on recent logs (Efficiency)
aiQuerySchema.index({ createdAt: -1 });

module.exports = mongoose.model('AIQuery', aiQuerySchema);
