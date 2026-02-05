const ProfessionalProfile = require('../models/ProfessionalProfile');
const User = require('../models/User');
const Cashfree = require('../config/cashfree');

// Create Cashfree Order Session
exports.createRegistrationOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        const profile = await ProfessionalProfile.findOne({ user: userId });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        if (profile.isPaid) {
            return res.status(400).json({ message: 'Already paid' });
        }

        const request = {
            order_amount: 250,
            order_currency: "INR",
            order_id: `reg_${userId}_${Date.now()}`,
            customer_details: {
                customer_id: userId,
                customer_phone: user.phone || "9999999999", // Default if phone missing
                customer_name: user.name,
                customer_email: user.email
            },
            order_meta: {
                payment_methods: "cc,dc,nb,upi"
            }
        };

        const response = await Cashfree.PGCreateOrder("2023-08-01", request);
        res.json({
            payment_session_id: response.data.payment_session_id,
            order_id: response.data.order_id
        });
    } catch (error) {
        console.error("Cashfree Order Error:", error.response?.data || error.message);
        res.status(500).json({ message: 'Payment initialization failed' });
    }
};

// Helper to finalize payment success logic
const mongoose = require('mongoose');

const handleSuccessfulPayment = async (userId, transactionId) => {
    // Validate if userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log(`Invalid User ID in payment (likely test event): ${userId}`);
        return;
    }

    const profile = await ProfessionalProfile.findOne({ user: userId });
    if (!profile || profile.isPaid) return;

    profile.isPaid = true;
    profile.paymentDate = new Date();
    profile.status = 'pending_submission';
    profile.transactionId = transactionId;

    if (profile.referredBy) {
        const referrerProfile = await ProfessionalProfile.findOne({ referralCode: profile.referredBy });
        if (referrerProfile) {
            const referrerUser = await User.findById(referrerProfile.user);
            const now = new Date();
            const registrationTime = new Date(referrerUser.createdAt);
            const diffHours = (now - registrationTime) / (1000 * 60 * 60);
            const rewardAmount = diffHours <= 24 ? 100 : 50;

            referrerProfile.walletBalance += rewardAmount;
            await referrerProfile.save();
        }
    }

    await profile.save();
};

// Verify Cashfree Payment Success (User initiated)
exports.verifyRegistrationPayment = async (req, res) => {
    try {
        const { order_id } = req.body;
        const userId = req.user.id;

        const response = await Cashfree.PGOrderFetchPayments("2023-08-01", order_id);
        const payments = response.data;

        const successfulPayment = payments.find(p => p.payment_status === "SUCCESS");

        if (!successfulPayment) {
            return res.status(400).json({ message: 'Payment not successful' });
        }

        await handleSuccessfulPayment(userId, successfulPayment.cf_payment_id);

        const profile = await ProfessionalProfile.findOne({ user: userId });
        res.json({ message: 'Payment verified successfully', status: profile.status });
    } catch (error) {
        console.error("Cashfree Verification Error:", error.response?.data || error.message);
        res.status(500).json({ message: 'Payment verification failed' });
    }
};

// Cashfree Webhook Handler
exports.cashfreeWebhook = async (req, res) => {
    try {
        const signature = req.headers['x-webhook-signature'];
        const timestamp = req.headers['x-webhook-timestamp'];

        // Use raw body buffer if available (captured in index.js)
        const rawBody = req.body instanceof Buffer ? req.body.toString('utf8') : JSON.stringify(req.body);
        const body = req.body instanceof Buffer ? JSON.parse(rawBody) : req.body;

        try {
            Cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);
        } catch (err) {
            console.error("Webhook Signature Verification Failed:", err.message);
            return res.status(400).send('Invalid signature');
        }

        const { data } = body;
        const orderId = data.order.order_id;
        const paymentStatus = data.payment.payment_status;

        if (paymentStatus === 'SUCCESS') {
            const parts = orderId.split('_');
            const userId = parts.length > 1 ? parts[1] : null; // Safe extraction

            if (!userId) {
                console.log(`Webhook received for non-standard Order ID: ${orderId} (Likely a Test Event)`);
                return res.status(200).send('Webhook ignore (Test Event)');
            }

            const transactionId = data.payment.cf_payment_id;

            await handleSuccessfulPayment(userId, transactionId);
            console.log(`Webhook Processed OK: Order ${orderId}`);
        }

        res.status(200).send('Webhook Processed');
    } catch (error) {
        console.error("Webhook Processor Error:", error.message);
        res.status(500).send('Internal Server Error');
    }
};

// Legacy/Mock payment - kept for fallback or internal use but routes will change
exports.processRegistrationPayment = async (req, res) => {
    // Replaced by Cashfree flow above
    res.status(410).json({ message: 'This endpoint is deprecated. Use Cashfree flow.' });
};
