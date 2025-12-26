const fs = require('fs').promises;
const path = require('path');
const Resume = require('../models/Resume');
const User = require('../models/User');
const parserService = require('../services/parserService');
const aiService = require('../services/aiService');

// Upload and analyze resume
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded' 
      });
    }

    const { path: filePath, originalname, mimetype } = req.file;
    const fileType = mimetype.includes('pdf') ? 'pdf' : 'docx';

    // Parse the file
    const parsedContent = await parserService.parseFile(filePath, fileType);

    if (!parsedContent || parsedContent.trim().length === 0) {
      // Clean up file
      await fs.unlink(filePath);
      return res.status(400).json({ 
        success: false,
        message: 'Unable to extract text from file. Please ensure the file is not empty or corrupted.' 
      });
    }

    // Analyze with AI
    const analysis = await aiService.analyzeResume(parsedContent);

    // Create resume document
    const resume = new Resume({
      user: req.user._id,
      fileName: originalname,
      filePath,
      fileType,
      parsedContent,
      analysis,
    });

    await resume.save();

    // Update user's resumes
    await User.findByIdAndUpdate(req.user._id, {
      $push: { resumes: resume._id }
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and analyzed successfully',
      data: { resume }
    });
  } catch (error) {
    // Clean up file if error occurs
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    next(error);
  }
};

// Get user's resume history
exports.getResumeHistory = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-parsedContent');

    res.json({
      success: true,
      data: { 
        resumes,
        count: resumes.length 
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get specific resume
exports.getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ 
        success: false,
        message: 'Resume not found' 
      });
    }

    res.json({
      success: true,
      data: { resume }
    });
  } catch (error) {
    next(error);
  }
};

// Delete resume
exports.deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ 
        success: false,
        message: 'Resume not found' 
      });
    }

    // Delete file
    try {
      await fs.unlink(resume.filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    // Delete from database
    await Resume.deleteOne({ _id: resume._id });

    // Remove from user's resumes
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { resumes: resume._id }
    });

    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
