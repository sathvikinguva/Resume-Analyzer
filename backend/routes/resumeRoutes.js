const express = require('express');
const resumeController = require('../controllers/resumeController');
const auth = require('../middleware/auth');
const upload = require('../config/multer');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Routes
router.post('/upload', upload.single('resume'), resumeController.uploadResume);
router.get('/history', resumeController.getResumeHistory);
router.get('/:id', resumeController.getResume);
router.delete('/:id', resumeController.deleteResume);

module.exports = router;
