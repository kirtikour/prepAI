const express = require('express');
const { protect } = require('../middleware/auth');
const { Resume, InterviewSession } = require('../models');
const router = express.Router();

// @desc    Get average score trend over time
// @route   GET /api/analytics/score-trend
// @access  Private
router.get('/score-trend', protect, async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user._id }).sort({ createdAt: 1 });
    const trend = sessions.map((s) => ({
      date: s.createdAt,
      score: s.averageScore,
    }));

    res.status(200).json({
      success: true,
      trend,
    });
  } catch (error) {
    console.error('Score trend analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching score trend' });
  }
});

// @desc    Get average scores grouped by category/role
// @route   GET /api/analytics/by-category
// @access  Private
router.get('/by-category', protect, async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user._id });
    
    const roleGroups = {};
    sessions.forEach((s) => {
      const role = s.role || 'General';
      if (!roleGroups[role]) {
        roleGroups[role] = { sum: 0, count: 0 };
      }
      roleGroups[role].sum += s.averageScore || 0;
      roleGroups[role].count += 1;
    });

    const byCategory = Object.keys(roleGroups).map((role) => ({
      role,
      averageScore: Math.round((roleGroups[role].sum / roleGroups[role].count) * 10) / 10,
    }));

    res.status(200).json({
      success: true,
      byCategory,
    });
  } catch (error) {
    console.error('Category breakdown analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching category breakdown' });
  }
});

// @desc    Get resume score history over time
// @route   GET /api/analytics/resume-history
// @access  Private
router.get('/resume-history', protect, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: 1 });
    const history = resumes.map((r) => ({
      date: r.createdAt,
      atsScore: r.atsScore,
    }));

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error('Resume history analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching resume history' });
  }
});

// @desc    Get past mock interview sessions with pagination
// @route   GET /api/analytics/sessions
// @access  Private
router.get('/sessions', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const totalCount = await InterviewSession.countDocuments({ userId: req.user._id });
    const sessions = await InterviewSession.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      sessions,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error('Sessions list analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching past sessions' });
  }
});

module.exports = router;
