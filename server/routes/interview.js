const express = require('express');
const { generateJson } = require('../utils/gemini');
const { protect } = require('../middleware/auth');
const { InterviewSession } = require('../models');
const router = express.Router();

// Helper: Call Gemini API to generate questions
const generateQuestions = async (role) => {
  const prompt = `Generate 5 interview questions for a ${role} position. Mix of technical and behavioral questions.
Return ONLY valid JSON, no markdown, no preamble:
{ "questions": string[] }`;

  const parsed = await generateJson(prompt);
  return parsed.questions;
};

// Helper: Call Gemini API to evaluate interview answer
const evaluateAnswer = async (question, answer) => {
  const prompt = `Evaluate this interview answer.
Question: ${question}
Answer: ${answer}
Return ONLY valid JSON, no markdown, no preamble:
{
  "score": number (0-10),
  "goodPoints": string[],
  "improvements": string[]
}`;

  return await generateJson(prompt);
};

// @desc    Start interview session
// @route   POST /api/interview/start
// @access  Private
router.post('/start', protect, async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ success: false, message: 'Please provide a role' });
    }

    console.log(`Starting mock interview for ${role} (user: ${req.user.name})`);

    // 1. Generate questions
    const questionTexts = await generateQuestions(role);

    // 2. Format questions for schema
    const questions = questionTexts.map((q) => ({
      question: q,
      answer: '',
      score: 0,
      feedback: '',
    }));

    // 3. Save session
    const session = await InterviewSession.create({
      userId: req.user._id,
      role,
      questions,
      averageScore: 0,
    });

    res.status(201).json({
      success: true,
      sessionId: session._id,
      role: session.role,
      firstQuestion: session.questions[0].question,
      questionIndex: 0,
      totalQuestions: session.questions.length,
    });
  } catch (error) {
    console.error('Interview start error:', error);
    res.status(500).json({ success: false, message: 'Server error starting interview' });
  }
});

// @desc    Submit answer to a question
// @route   POST /api/interview/answer
// @access  Private
router.post('/answer', protect, async (req, res) => {
  try {
    const { sessionId, questionIndex, answer } = req.body;

    if (!sessionId || questionIndex === undefined || answer === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide sessionId, questionIndex, and answer' });
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    if (questionIndex < 0 || questionIndex >= session.questions.length) {
      return res.status(400).json({ success: false, message: 'Invalid question index' });
    }

    const questionText = session.questions[questionIndex].question;
    console.log(`Evaluating answer for session ${sessionId}, question ${questionIndex + 1}...`);

    // Evaluate answer with AI
    const evaluation = await evaluateAnswer(questionText, answer);

    // Save answer and evaluation to session document
    session.questions[questionIndex].answer = answer;
    session.questions[questionIndex].score = evaluation.score;
    // Store structured feedback as stringified JSON in the text field
    session.questions[questionIndex].feedback = JSON.stringify({
      goodPoints: evaluation.goodPoints,
      improvements: evaluation.improvements,
    });

    await session.save();

    const isCompleted = questionIndex === session.questions.length - 1;
    const nextQuestion = isCompleted ? null : session.questions[questionIndex + 1].question;

    res.status(200).json({
      success: true,
      evaluation: {
        score: evaluation.score,
        goodPoints: evaluation.goodPoints,
        improvements: evaluation.improvements,
      },
      nextQuestion,
      isCompleted,
    });
  } catch (error) {
    console.error('Answer submission error:', error);
    res.status(500).json({ success: false, message: 'Server error processing answer' });
  }
});

// @desc    Complete interview session and compute average
// @route   POST /api/interview/complete
// @access  Private
router.post('/complete', protect, async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Please provide sessionId' });
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    // Compute average (scale to percentage 0-100)
    const sum = session.questions.reduce((acc, q) => acc + (q.score || 0), 0);
    const averageScore = Math.round((sum / session.questions.length) * 10); // scale 0-10 to 0-100

    session.averageScore = averageScore;
    await session.save();

    console.log(`Interview session ${sessionId} completed. Avg Score: ${averageScore}%`);

    // Format response questions to parse feedback back to object
    const formattedQuestions = session.questions.map((q) => {
      let parsedFeedback = { goodPoints: [], improvements: [] };
      try {
        if (q.feedback) {
          parsedFeedback = JSON.parse(q.feedback);
        }
      } catch (e) {
        parsedFeedback = { goodPoints: [q.feedback], improvements: [] };
      }

      return {
        question: q.question,
        answer: q.answer,
        score: q.score,
        goodPoints: parsedFeedback.goodPoints,
        improvements: parsedFeedback.improvements,
      };
    });

    res.status(200).json({
      success: true,
      session: {
        id: session._id,
        role: session.role,
        averageScore: session.averageScore,
        createdAt: session.createdAt,
        questions: formattedQuestions,
      },
    });
  } catch (error) {
    console.error('Session completion error:', error);
    res.status(500).json({ success: false, message: 'Server error completing interview' });
  }
});

// @desc    Get past interview history for user
// @route   GET /api/interview/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user._id }).sort({ createdAt: -1 });

    const formattedSessions = sessions.map((s) => ({
      id: s._id,
      role: s.role,
      averageScore: s.averageScore,
      createdAt: s.createdAt,
      questionCount: s.questions.length,
    }));

    res.status(200).json({
      success: true,
      sessions: formattedSessions,
    });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching history' });
  }
});

module.exports = router;
