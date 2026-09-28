require('dotenv').config();
const mongoose = require('mongoose');
const { seedInitialData } = require('../utils/seedData');

// Disable buffering so queries fail immediately with the real connection error instead of timing out after 10s
mongoose.set('bufferCommands', false);

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, seeded: false };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const connStr = process.env.MONGODB_URI || (process.env.VERCEL ? null : 'mongodb://127.0.0.1:27017/easytax_db');

  if (!connStr) {
    throw new Error('MONGODB_URI environment variable is missing in Vercel settings.');
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    };

    cached.promise = mongoose.connect(connStr, opts).then(async (m) => {
      console.log(`✅ MongoDB Connected successfully to host: ${m.connection.host}`);
      if (!cached.seeded) {
        try {
          await seedInitialData();
          cached.seeded = true;
        } catch (e) {
          console.warn('Seed warning:', e.message);
        }
      }
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
