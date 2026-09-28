const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Route imports
const businessRoutes = require('./routes/businessRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const checklistRoutes = require('./routes/checklistRoutes');
const documentRoutes = require('./routes/documentRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    project: 'EasyTax Support - Digital Tax Filing Support for Small Businesses',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/business', businessRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/checklist', checklistRoutes);
app.use('/api/documents', documentRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
