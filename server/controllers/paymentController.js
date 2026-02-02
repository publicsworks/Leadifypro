const ProfessionalProfile = require('../models/ProfessionalProfile');
const User = require('../models/User');

// Mock Payment Success
exports.processRegistrationPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const profile = await ProfessionalProfile.findOne({ user: userId });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        if (profile.isPaid) {
            return res.status(400).json({ message: 'Already paid' });
        }

        // 1. Mark as Paid and Under Review
        profile.isPaid = true;
        profile.paymentDate = new Date();
        profile.status = 'pending_submission';

        // 2. Handle Referral Logic
        if (profile.referredBy) {
            // Find the referrer
            const referrerProfile = await ProfessionalProfile.findOne({ referralCode: profile.referredBy });

            if (referrerProfile) {
                const referrerUser = await User.findById(referrerProfile.user);

                // Logic: Check if Referrer's registration is within last 24 hours
                // Assuming we use User.createdAt which is set at registration time
                const now = new Date();
                const registrationTime = new Date(referrerUser.createdAt);
                const diffMs = now - registrationTime;
                const diffHours = diffMs / (1000 * 60 * 60);

                const isDoubleReward = diffHours <= 24;

                const rewardAmount = isDoubleReward ? 100 : 50;
                // Alternatively: 1 extra client (Normal) or 2 extra clients (Double)
                // Integrating logic: User chooses? Detailed prompt says "OR".
                // For MVP, we will simpler adds Wallet Credit.
                // NOTE: "₹50 wallet credit OR 1 extra client". 
                // Let's implement Wallet Credit by default for now as it's easier to track numerically.
                // We'll add a 'freeClientsDetails' field to track clients if we want to support that later or swap.

                referrerProfile.walletBalance += rewardAmount;
                await referrerProfile.save();

                console.log(`Referral processed. Referrer ${referrerProfile.referralCode} got ₹${rewardAmount}. Double? ${isDoubleReward}`);
            }
        }

        await profile.save();

        res.json({ message: 'Payment successful, profile under review', status: profile.status });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
