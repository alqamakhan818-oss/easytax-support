const mongoose = require('mongoose');

/**
 * Middleware: requireBusinessContext
 * Extracts and validates the X-Business-Id header.
 * Attaches req.businessId to the request for workspace-isolated database operations.
 * Note: This is an academic workspace-separation mechanism, NOT user authentication.
 */
const requireBusinessContext = (req, res, next) => {
  const businessId = req.header('X-Business-Id') || req.headers['x-business-id'];

  if (!businessId) {
    return res.status(400).json({
      success: false,
      message: 'Business workspace identifier is required (X-Business-Id header missing)',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid business workspace identifier format',
    });
  }

  req.businessId = businessId;
  next();
};

module.exports = {
  requireBusinessContext,
};
