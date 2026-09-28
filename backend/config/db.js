const mongoose = require('mongoose');
const { seedInitialData } = require('../utils/seedData');

let isConnected = false;

const connectDB = async () => {
  // Reuse existing connection if already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Wait if connection is currently in progress
  if (mongoose.connection.readyState === 2) {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));
    return mongoose.connection;
  }

  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/easytax_db';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Seed initial demo data if database is empty
    await seedInitialData();
    isConnected = true;
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
