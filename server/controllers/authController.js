const User = require('../models/User');
const ProfessionalProfile = require('../models/ProfessionalProfile');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Generate a random 6-character referral code
const generateReferralCode = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
};

exports.registerUser = async (req, res) => {
    const { name, email, password, role, category, referredBy } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = await User.create({
            name,
            email,
            password,
            role
        });

        if (role === 'professional') {
            const referralCode = generateReferralCode();
            await ProfessionalProfile.create({
                user: user._id,
                category: category || 'General',
                referralCode,
                referredBy: referredBy || null,
                status: 'pending_payment'
            });
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            let profileData = {};
            if (user.role === 'professional') {
                const profile = await ProfessionalProfile.findOne({ user: user._id });
                if (profile) profileData = { status: profile.status, isPaid: profile.isPaid };
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                ...profileData,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        let profile = null;
        if (user.role === 'professional') {
            profile = await ProfessionalProfile.findOne({ user: user._id });
        }
        res.json({ user, profile });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
