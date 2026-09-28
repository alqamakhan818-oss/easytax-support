const express = require('express');
const router = express.Router();
const {
  getChecklist,
  updateChecklist,
} = require('../controllers/checklistController');

router.route('/')
  .get(getChecklist)
  .put(updateChecklist);

module.exports = router;
