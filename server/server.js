const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL
].filter(Boolean);
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Serve static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Auth server is running' });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prepai';

const startServer = async () => {
  let dbUri = MONGO_URI;
  
  try {
    console.log('Attempting to connect to local MongoDB database...');
    await mongoose.connect(dbUri, { serverSelectionTimeoutMS: 1500 });
    console.log('Connected to local MongoDB database');
    global.useMockDb = false;
  } catch (err) {
    console.log('Local MongoDB not running. Falling back to in-memory mock database...');
    global.useMockDb = true;
    console.log('SUCCESS: Mock database mode activated. Candidate profiles will persist in RAM.');
  }

  // Import routes after db mode is decided
  const authRoutes = require('./routes/auth');
  const dashboardRoutes = require('./routes/dashboard');
  const resumeRoutes = require('./routes/resume');
  const interviewRoutes = require('./routes/interview');
  const analyticsRoutes = require('./routes/analytics');

  // Mount routers
  app.use('/api/auth', authRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/resume', resumeRoutes);
  app.use('/api/interview', interviewRoutes);
  app.use('/api/analytics', analyticsRoutes);

  // Error handling middleware (must be after routes)
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'An internal server error occurred' });
  });

  app.listen(PORT, () => {
    console.log(`Express auth server running on port ${PORT}`);
  });
};

startServer();
