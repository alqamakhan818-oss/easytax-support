const express = require('express');
const router = express.Router();
const {
  getDocuments,
  updateDocumentStatus,
  addCustomDocument,
} = require('../controllers/documentController');
const { requireBusinessContext } = require('../middleware/businessContext');

router.use(requireBusinessContext);

router.route('/')
  .get(getDocuments)
  .put(updateDocumentStatus)
  .post(addCustomDocument);

module.exports = router;
