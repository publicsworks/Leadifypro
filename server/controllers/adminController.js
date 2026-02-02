const ProfessionalProfile = require('../models/ProfessionalProfile');
const User = require('../models/User');

exports.getPendingApprovals = async (req, res) => {
    try {
        const profiles = await ProfessionalProfile.find({ status: 'under_review' })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfileStatus = async (req, res) => {
    const { id, action } = req.body; // action: 'approve' | 'reject'

    try {
        const profile = await ProfessionalProfile.findById(id);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        if (action === 'approve') {
            profile.status = 'approved';
            // Grant initial leads if needed
        } else if (action === 'reject') {
            profile.status = 'inactive'; // or 'rejected'
            // No refund logic needed as per requirements
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        await profile.save();
        res.json({ message: `Profile ${action}d successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const pendingReviews = await ProfessionalProfile.countDocuments({ status: 'under_review' });
        const revenue = (await ProfessionalProfile.countDocuments({ isPaid: true })) * 250;

        res.json({ totalUsers, pendingReviews, revenue });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
