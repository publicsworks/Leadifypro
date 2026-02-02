const cloudinary = require('../config/cloudinary');
const ProfessionalProfile = require('../models/ProfessionalProfile');
const fs = require('fs');

exports.uploadPortfolio = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "auto",
            folder: "proleads_portfolio"
        });

        // Remove file from local uploads folder
        fs.unlinkSync(req.file.path);

        const profile = await ProfessionalProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        const newPortfolioItem = {
            type: result.resource_type === 'video' ? 'video' : 'image',
            url: result.secure_url,
            public_id: result.public_id,
            description: req.body.description || 'Portfolio Item'
        };

        profile.portfolio.push(newPortfolioItem);
        await profile.save();

        res.json(newPortfolioItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
};

exports.updateDescription = async (req, res) => {
    try {
        const { description } = req.body;

        const profile = await ProfessionalProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        profile.description = description;
        await profile.save();

        res.json({ message: 'Description updated successfully', description: profile.description });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Update failed', error: error.message });
    }
};

exports.submitApplication = async (req, res) => {
    try {
        const profile = await ProfessionalProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        profile.status = 'under_review';
        await profile.save();

        res.json({ message: 'Application submitted successfully', status: profile.status });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Submission failed', error: error.message });
    }
};
