const { getGeminiResponse } = require('../services/geminiService');
const AIQuery = require('../models/AIQuery');

// @desc    Get AI responses for general visitor enquiries
// @route   POST /api/ai/chat
// @access  Public
const askAssistant = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query) {
      res.status(400);
      return next(new Error('Please add your question'));
    }

    const responseText = await getGeminiResponse('assistant', query);

    // Save to Database
    try {
      await AIQuery.create({
        userId: req.user ? req.user._id : null,
        category: 'assistant',
        query,
        response: responseText,
      });
    } catch (dbErr) {
      console.warn('⚠️ Could not log query to database: ', dbErr.message);
    }

    res.json({ query, response: responseText });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI responses for match day companion (rules/formations/teams)
// @route   POST /api/ai/companion
// @access  Public
const askCompanion = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query) {
      res.status(400);
      return next(new Error('Please specify your football match question'));
    }

    const responseText = await getGeminiResponse('companion', query);

    // Save to Database
    try {
      await AIQuery.create({
        userId: req.user ? req.user._id : null,
        category: 'companion',
        query,
        response: responseText,
      });
    } catch (dbErr) {
      console.warn('⚠️ Could not log query to database: ', dbErr.message);
    }

    res.json({ query, response: responseText });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI recommendations for sustainability
// @route   POST /api/ai/sustainability
// @access  Public
const askSustainability = async (req, res, next) => {
  try {
    const { query } = req.body;
    const finalQuery = query || 'Suggest standard energy and waste reduction actions';
    const responseText = await getGeminiResponse('sustainability', finalQuery);

    // Save to Database
    try {
      await AIQuery.create({
        userId: req.user ? req.user._id : null,
        category: 'sustainability',
        query: finalQuery,
        response: responseText,
      });
    } catch (dbErr) {
      console.warn('⚠️ Could not log query to database: ', dbErr.message);
    }

    res.json({ query: finalQuery, response: responseText });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  askAssistant,
  askCompanion,
  askSustainability,
};
