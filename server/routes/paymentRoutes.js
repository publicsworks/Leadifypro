const express = require('express');
const router = express.Router();
const { createRegistrationOrder, verifyRegistrationPayment, cashfreeWebhook } = require('../controllers/paymentController');
const { manualPaymentUnlock } = require('../controllers/manualUnlockController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-order', protect, createRegistrationOrder);
router.post('/verify-payment', protect, verifyRegistrationPayment);
router.post('/webhook', cashfreeWebhook); // Public for Cashfree notifications
router.post('/manual-unlock', manualPaymentUnlock); // Emergency manual unlock (NO AUTH for admin use)

module.exports = router;
