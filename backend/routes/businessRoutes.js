const express = require('express');
const router = express.Router();
const {
  getBusiness,
  updateBusiness,
  resetDemoData,
} = require('../controllers/businessController');

router.route('/')
  .get(getBusiness)
  .put(updateBusiness);

router.post('/reset', resetDemoData);

module.exports = router;
