const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    type: { type: String, enum: ['image', 'video'], required: true },
    url: { type: String, required: true },
    public_id: { type: String },
    description: { type: String, default: 'My work' }
});

const professionalProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    introVideo: {
        url: String,
        public_id: String
    },
    portfolio: [portfolioSchema],
    isPaid: {
        type: Boolean,
        default: false
    },
    paymentDate: {
        type: Date
    },
    referralCode: {
        type: String,
        unique: true
    },
    referredBy: {
        type: String // Referral code of the person who referred this professional
    },
    walletBalance: {
        type: Number,
        default: 0
    },
    freeClientsDetails: {
        type: Number, // Count of extra free clients earned
        default: 0
    },
    status: {
        type: String,
        enum: ['pending_payment', 'pending_submission', 'under_review', 'approved', 'rejected', 'inactive'],
        default: 'pending_payment'
    },
    reviewNote: String,
    leadsCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('ProfessionalProfile', professionalProfileSchema);
