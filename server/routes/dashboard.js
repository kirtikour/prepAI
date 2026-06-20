const express = require('express');
const { protect } = require('../middleware/auth');
const { Resume, InterviewSession } = require('../models');
const router = express.Router();

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    // 1. Fetch latest resume score
    const latestResume = await Resume.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    const resumeScore = latestResume ? latestResume.atsScore : null;

    // 2. Fetch interviews completed count
    const interviewCount = await InterviewSession.countDocuments({ userId: req.user._id });

    // 3. Calculate average interview score
    const sessions = await InterviewSession.find({ userId: req.user._id });
    let averageScore = 0;
    if (sessions.length > 0) {
      const sum = sessions.reduce((acc, session) => acc + (session.averageScore || 0), 0);
      averageScore = Math.round(sum / sessions.length);
    }

    res.status(200).json({
      success: true,
      stats: {
        resumeScore,
        interviewCount,
        averageScore,
      },
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching statistics' });
  }
});

// @desc    Get recent activities feed (resume and interview sessions)
// @route   GET /api/dashboard/activity
// @access  Private
router.get('/activity', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch latest 5 resumes and 5 interviews
    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 }).limit(5);
    const interviews = await InterviewSession.find({ userId }).sort({ createdAt: -1 }).limit(5);

    // Format resumes
    const resumeActivities = resumes.map((r) => {
      let scoreText = 'Review Needed';
      if (r.atsScore >= 85) scoreText = 'Master';
      else if (r.atsScore >= 70) scoreText = 'Good';

      return {
        id: r._id,
        type: 'resume',
        title: `Resume Optimization: ${r.fileUrl.split('\\').pop().split('/').pop() || 'Uploaded Resume'}`,
        timestamp: r.createdAt,
        score: r.atsScore,
        scoreText,
      };
    });

    // Format interviews
    const interviewActivities = interviews.map((i) => {
      let scoreText = 'Needs Practice';
      if (i.averageScore >= 85) scoreText = 'Excellent';
      else if (i.averageScore >= 70) scoreText = 'Good';

      return {
        id: i._id,
        type: 'interview',
        title: `Technical Interview: ${i.role}`,
        timestamp: i.createdAt,
        score: i.averageScore,
        scoreText,
      };
    });

    // Merge and sort by date descending, take top 5
    const activities = [...resumeActivities, ...interviewActivities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    res.status(200).json({
      success: true,
      activities,
    });
  } catch (error) {
    console.error('Activity fetch error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching recent activity' });
  }
});

module.exports = router;
