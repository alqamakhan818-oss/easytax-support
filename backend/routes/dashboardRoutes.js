const express = require('express');
const router = express.Router();
const { getDashboardSummary } = require('../controllers/dashboardController');
const { requireBusinessContext } = require('../middleware/businessContext');

router.get('/', requireBusinessContext, getDashboardSummary);

module.exports = router;
