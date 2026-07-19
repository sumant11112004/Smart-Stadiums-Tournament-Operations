const express = require('express');
const router = express.Router();
const { getCrowdStatus, updateCrowdZone } = require('../controllers/crowdController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/status', getCrowdStatus);
router.put('/status/:id', protect, admin, updateCrowdZone);

module.exports = router;
