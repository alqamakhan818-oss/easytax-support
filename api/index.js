const app = require('../backend/app');
const connectDB = require('../backend/config/db');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Serverless MongoDB Connection Error:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Database connection failed. Please ensure the MONGODB_URI environment variable is configured in your Vercel project settings.',
      details: err.message,
    });
  }

  return app(req, res);
};
