const express = require('express');
const router = express.Router();
const { getPendingApprovals, updateProfileStatus, getDashboardStats } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

const adminGuard = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as admin' });
    }
};

router.get('/pending', protect, adminGuard, getPendingApprovals);
router.post('/action', protect, adminGuard, updateProfileStatus);
router.get('/stats', protect, adminGuard, getDashboardStats);

module.exports = router;
