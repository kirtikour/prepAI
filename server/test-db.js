const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prepai';

console.log('Testing connection to MongoDB...');

const runTest = async () => {
  let dbUri = MONGO_URI;
  try {
    console.log('Attempting connection to local MongoDB database...');
    await mongoose.connect(dbUri, { serverSelectionTimeoutMS: 2000 });
    console.log('SUCCESS: Connected to local MongoDB successfully.');
    process.exit(0);
  } catch (err) {
    console.log('Local MongoDB connection failed (ECONNREFUSED). Trying in-memory MongoDB...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      dbUri = mongod.getUri();
      console.log('In-memory MongoDB server started at:', dbUri);
      await mongoose.connect(dbUri);
      console.log('SUCCESS: Connected to in-memory MongoDB database successfully.');
      process.exit(0);
    } catch (memErr) {
      console.error('ERROR: Failed to connect to either database:', memErr.message);
      process.exit(1);
    }
  }
};

runTest();
