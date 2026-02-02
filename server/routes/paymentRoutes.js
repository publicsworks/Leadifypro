const express = require('express');
const router = express.Router();
const { processRegistrationPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/registration-fee', protect, processRegistrationPayment);

module.exports = router;
