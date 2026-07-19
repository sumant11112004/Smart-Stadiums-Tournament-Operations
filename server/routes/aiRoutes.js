const express = require('express');
const router = express.Router();
const { askAssistant, askCompanion, askSustainability } = require('../controllers/aiController');

router.post('/chat', askAssistant);
router.post('/companion', askCompanion);
router.post('/sustainability', askSustainability);

module.exports = router;
