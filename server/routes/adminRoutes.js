const express = require('express');
const router = express.Router();
const { getDashboardMetrics } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, admin, getDashboardMetrics);

module.exports = router;
