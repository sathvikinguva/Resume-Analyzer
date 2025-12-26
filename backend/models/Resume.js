const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
    enum: ['pdf', 'docx'],
  },
  parsedContent: {
    type: String,
    required: true,
  },
  analysis: {
    overallAssessment: String,
    strengths: [String],
    weaknesses: [String],
    skillGaps: [String],
    suggestions: [String],
    sectionFeedback: {
      contact: String,
      summary: String,
      experience: String,
      education: String,
      skills: String,
      projects: String,
    },
    score: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Resume', resumeSchema);
