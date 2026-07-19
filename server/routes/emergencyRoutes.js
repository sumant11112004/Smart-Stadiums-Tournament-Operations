const express = require('express');
const router = express.Router();
const { getActiveAlerts, triggerAlert, resolveAlert } = require('../controllers/emergencyController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/alerts', getActiveAlerts);
router.post('/trigger', protect, triggerAlert);
router.put('/resolve/:id', protect, admin, resolveAlert);

module.exports = router;
