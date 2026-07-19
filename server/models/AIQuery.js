const mongoose = require('mongoose');

const aiQuerySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for anonymous visitors
    },
    category: {
      type: String,
      enum: ['assistant', 'companion', 'sustainability', 'general'],
      default: 'general',
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

module.exports = mongoose.model('AIQuery', aiQuerySchema);
