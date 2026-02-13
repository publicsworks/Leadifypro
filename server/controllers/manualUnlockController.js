const ProfessionalProfile = require('../models/ProfessionalProfile');
const User = require('../models/User');

// Emergency Manual Payment Unlock
// Use this ONLY when webhook fails and you need to manually verify a payment
exports.manualPaymentUnlock = async (req, res) => {
    try {
        const { email, orderId, adminSecret } = req.body;

        // Security Check: Verify Admin Secret
        const MASTER_SECRET = process.env.MANUAL_UNLOCK_SECRET || "LeadifyPro_Emergency_2026";
        if (adminSecret !== MASTER_SECRET) {
            console.warn(`Unauthorized Manual Unlock Attempt for: ${email}`);
            return res.status(401).json({ message: 'Unauthorized: Invalid Admin Secret' });
        }

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        console.log(`=== MANUAL UNLOCK REQUEST ===`);
        console.log(`Email: ${email}`);
        console.log(`Order ID: ${orderId || 'Not provided'}`);

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: 'User not found with this email' });
        }

        // Find professional profile
        const profile = await ProfessionalProfile.findOne({ user: user._id });
        if (!profile) {
            return res.status(404).json({ message: 'Professional profile not found' });
        }

        // Check if already paid
        if (profile.isPaid) {
            return res.json({
                message: 'Profile is already unlocked',
                status: profile.status,
                isPaid: true
            });
        }

        // Manual unlock
        profile.isPaid = true;
        profile.status = 'pending_submission';
        profile.paymentDate = new Date();
        if (orderId) {
            profile.transactionId = orderId;
        }

        await profile.save();

        console.log(`Manual unlock successful for user: ${email}`);
        console.log(`New status: ${profile.status}, isPaid: ${profile.isPaid}`);

        return res.json({
            message: 'Payment manually unlocked successfully',
            status: profile.status,
            isPaid: profile.isPaid,
            email: email
        });

    } catch (error) {
        console.error('Manual unlock error:', error);
        return res.status(500).json({
            message: 'Manual unlock failed',
            error: error.message
        });
    }
};
