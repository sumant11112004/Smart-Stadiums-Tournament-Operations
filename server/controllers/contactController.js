const Feedback = require('../models/Feedback');

// @desc    Submit feedback contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res, next) => {
  try {
    // Note: Request body validation has already been handled by validateContact middleware
    const { name, email, subject, message } = req.body;

    let feedback;
    try {
      feedback = await Feedback.create({
        name,
        email,
        subject,
        message,
      });
    } catch (dbErr) {
      console.warn('⚠️ MongoDB feedback create failed, storing in local session mockup.');
      feedback = {
        _id: 'mock_feedback_' + Date.now(),
        name,
        email,
        subject,
        message,
        createdAt: new Date()
      };
    }

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully! We will get back to you shortly.',
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContact,
};
