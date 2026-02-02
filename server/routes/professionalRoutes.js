const express = require('express');
const router = express.Router();
const { uploadPortfolio } = require('../controllers/professionalController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// POST /api/professional/upload
router.post('/upload', protect, upload.single('file'), uploadPortfolio);
// PUT /api/professional/update-description
router.put('/update-description', protect, require('../controllers/professionalController').updateDescription);
// POST /api/professional/submit-application
router.post('/submit-application', protect, require('../controllers/professionalController').submitApplication);

module.exports = router;
