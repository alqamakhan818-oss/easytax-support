const express = require('express');
const router = express.Router();
const {
  getDocuments,
  updateDocumentStatus,
  addCustomDocument,
} = require('../controllers/documentController');

router.route('/')
  .get(getDocuments)
  .put(updateDocumentStatus)
  .post(addCustomDocument);

module.exports = router;
