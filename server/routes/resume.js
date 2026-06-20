const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');
const cloudinary = require('cloudinary').v2;
const { generateJson } = require('../utils/gemini');
const { protect } = require('../middleware/auth');
const { Resume } = require('../models');
const router = express.Router();

// Configure Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf' || ext === '.docx') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  },
});

// Configure Cloudinary if credentials exist
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.log('NOTE: Cloudinary not configured. Uploaded resumes will be stored locally.');
  // Ensure local uploads directory exists
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

// Helper: Upload file and get URL
const getFileUrl = (file, req) => {
  return new Promise((resolve, reject) => {
    if (isCloudinaryConfigured) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'raw', folder: 'prepai_resumes' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );
      uploadStream.end(file.buffer);
    } else {
      // Local storage fallback
      const filename = `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`;
      const filePath = path.join(__dirname, '../uploads', filename);
      fs.writeFileSync(filePath, file.buffer);
      // Return local server URL
      const localUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
      resolve(localUrl);
    }
  });
};

// Helper: Extract text from file buffer
const extractText = async (file) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf') {
    const uint8Array = new Uint8Array(file.buffer);
    const parser = new PDFParse(uint8Array);
    const data = await parser.getText();
    return data.text;
  } else if (ext === '.docx') {
    const data = await mammoth.extractRawText({ buffer: file.buffer });
    return data.value;
  }
  throw new Error('Unsupported format');
};

// Helper: Call Gemini API using the reusable helper
const getAiAnalysis = async (extractedText, jobTitle) => {
  const prompt = `Analyze this resume text for ATS compatibility for a ${jobTitle} role.
Return ONLY valid JSON with this exact structure, no markdown formatting, no preamble:
{
  "atsScore": number (0-100),
  "strengths": string[],
  "weaknesses": string[],
  "missingKeywords": string[]
}
Resume text: ${extractedText}`;

  return await generateJson(prompt);
};

// @desc    Upload and analyze resume
// @route   POST /api/resume/upload
// @access  Private
router.post('/upload', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const jobTitle = req.body.jobTitle || 'Software Engineer';

    console.log(`Processing resume upload for user: ${req.user.name}, target: ${jobTitle}`);

    // 1. Upload file and get URL
    const fileUrl = await getFileUrl(req.file, req);

    // 2. Extract text from resume
    const extractedResumeText = await extractText(req.file);

    if (!extractedResumeText || !extractedResumeText.trim()) {
      return res.status(400).json({ success: false, message: 'Failed to extract text from the file.' });
    }

    // 3. Send text to Gemini for ATS compatibility
    const analysis = await getAiAnalysis(extractedResumeText, jobTitle);

    // 4. Save to database
    const resume = await Resume.create({
      userId: req.user._id,
      fileUrl,
      extractedText: extractedResumeText,
      atsScore: analysis.atsScore,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      missingKeywords: analysis.missingKeywords,
    });

    res.status(201).json({
      success: true,
      message: 'Resume analyzed successfully',
      resume,
    });
  } catch (error) {
    console.error('Resume processing error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during resume processing' });
  }
});

// @desc    Get latest resume analysis
// @route   GET /api/resume/latest
// @access  Private
router.get('/latest', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'No resume found for this user' });
    }
    res.status(200).json({ success: true, resume });
  } catch (error) {
    console.error('Get latest resume error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Apply fix to resume weakness and re-evaluate
// @route   POST /api/resume/apply-fix
// @access  Private
router.post('/apply-fix', protect, async (req, res) => {
  try {
    const { resumeId, weakness } = req.body;
    if (!weakness) {
      return res.status(400).json({ success: false, message: 'Please provide a weakness to fix' });
    }

    let resume;
    if (resumeId) {
      resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    } else {
      resume = await Resume.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    }

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const jobTitle = req.body.jobTitle || 'Software Engineer';
    console.log(`Applying fix to resume ${resume._id} for weakness: ${weakness}, target: ${jobTitle}`);

    const rewritePrompt = `Analyze this candidate's resume and address the specified weakness.
Resume text:
"""
${resume.extractedText}
"""

ATS Weakness to address: "${weakness}"

Rewrite the resume text to improve it and resolve this weakness. Keep all other details exactly the same.
Return ONLY valid JSON with this exact structure:
{
  "updatedText": "string (the full rewritten resume text)"
}`;

    const rewriteResult = await generateJson(rewritePrompt);
    const cleanUpdatedText = rewriteResult.updatedText || resume.extractedText;

    if (!cleanUpdatedText || !cleanUpdatedText.trim()) {
      return res.status(500).json({ success: false, message: 'Failed to rewrite resume text' });
    }

    const analysis = await getAiAnalysis(cleanUpdatedText, jobTitle);

    resume.extractedText = cleanUpdatedText;
    resume.atsScore = analysis.atsScore;
    resume.strengths = analysis.strengths;
    resume.weaknesses = analysis.weaknesses;
    resume.missingKeywords = analysis.missingKeywords;

    await resume.save();

    res.status(200).json({
      success: true,
      message: 'Resume weakness fixed and re-evaluated successfully',
      resume,
    });
  } catch (error) {
    console.error('Apply fix error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during apply fix' });
  }
});

module.exports = router;
