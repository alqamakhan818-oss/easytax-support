const express = require('express');
const router = express.Router();
const {
  getChecklist,
  updateChecklist,
} = require('../controllers/checklistController');
const { requireBusinessContext } = require('../middleware/businessContext');

router.use(requireBusinessContext);

router.route('/')
  .get(getChecklist)
  .put(updateChecklist);

module.exports = router;
