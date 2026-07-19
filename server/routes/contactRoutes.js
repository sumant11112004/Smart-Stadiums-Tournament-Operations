const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');
const { validateContact } = require('../middleware/validationMiddleware');

router.post('/', validateContact, submitContact);

module.exports = router;
