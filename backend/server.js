const dotenv = require('dotenv');
// Load env vars
dotenv.config();

const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`🚀 EasyTax Backend Server running on port ${PORT}`);
      console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
    });

    const handleShutdown = () => {
      console.log('\nGracefully shutting down...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', handleShutdown);
    process.on('SIGINT', handleShutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
