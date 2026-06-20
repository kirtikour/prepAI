const mongoose = require('mongoose');
const { User, Resume, InterviewSession } = require('./models');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prepai';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to database for seeding...');

    // Find a user to attach seed data to
    const user = await User.findOne({});
    if (!user) {
      console.log('ERROR: No users found. Please sign up a user in the UI first, then run this seed script.');
      process.exit(1);
    }

    console.log(`Seeding data for user: ${user.name} (${user.email})`);

    // Clean existing data for this user
    await Resume.deleteMany({ userId: user._id });
    await InterviewSession.deleteMany({ userId: user._id });

    // Seed 1 Resume
    const resume = await Resume.create({
      userId: user._id,
      fileUrl: '/resumes/alex_johnson_cv.pdf',
      extractedText: 'Alex Johnson Software Engineer Resume. React, TypeScript, Node.js, Frontend architectures.',
      atsScore: 78,
      strengths: ['Modern React hooks', 'TypeScript type safety', 'Tailwind responsive design'],
      weaknesses: ['Edge case error handling', 'State management scales'],
      missingKeywords: ['Docker', 'Kubernetes', 'CI/CD Pipelines'],
    });
    console.log('Seeded Resume:', resume.fileUrl);

    // Seed Interview Sessions
    const session1 = await InterviewSession.create({
      userId: user._id,
      role: 'Senior Frontend Engineer',
      questions: [
        {
          question: 'What is React Virtual DOM?',
          answer: 'It is a lightweight representation of the real DOM in memory, updated by React and reconciled.',
          score: 9,
          feedback: JSON.stringify({
            goodPoints: ['Excellent explanation of reconciliation and rendering.', 'Clear description of Virtual DOM memory models.'],
            improvements: ['Could clarify the diffing algorithm (reconciliation process) in more detail.']
          }),
        },
        {
          question: 'How do you structure edge case checks in API requests?',
          answer: 'Usually by wrapping in try/catch and doing validations, but sometimes I rush through them.',
          score: 8,
          feedback: JSON.stringify({
            goodPoints: ['Accurate identification of basic try/catch wrappers.', 'Honest appraisal of execution speed vs safety.'],
            improvements: ['Should expand on exponential backoff and retry policies.', 'Explain how circuit breakers protect API routes.']
          }),
        },
      ],
      averageScore: 85,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    });
    console.log('Seeded Interview Session 1:', session1.role);

    const session2 = await InterviewSession.create({
      userId: user._id,
      role: 'System Design Patterns Quiz',
      questions: [
        {
          question: 'Explain MVC vs MVVM patterns.',
          answer: 'MVC separates Model, View, Controller. MVVM uses Model, View, ViewModel for data-binding.',
          score: 9,
          feedback: JSON.stringify({
            goodPoints: ['Perfect categorization of MVC layers.', 'Clear explanation of MVVM ViewModel data-bindings.'],
            improvements: ['Could give a real-world example like Angular or React data models.']
          }),
        },
      ],
      averageScore: 92,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    });
    console.log('Seeded Interview Session 2:', session2.role);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
