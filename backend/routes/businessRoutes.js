const express = require('express');
const router = express.Router();
const {
  getBusiness,
  getAllBusinesses,
  createBusiness,
  updateBusiness,
  resetDemoData,
} = require('../controllers/businessController');
const { requireBusinessContext } = require('../middleware/businessContext');

// Public listing for workspace switcher
router.get('/all', getAllBusinesses);

// POST /api/business creates a new workspace (does not require an existing ID)
router.post('/', createBusiness);

// Protected routes require valid X-Business-Id
router.route('/')
  .get(requireBusinessContext, getBusiness)
  .put(requireBusinessContext, updateBusiness);

router.post('/reset', requireBusinessContext, resetDemoData);

module.exports = router;
