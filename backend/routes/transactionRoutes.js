const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getCategories,
} = require('../controllers/transactionController');
const { requireBusinessContext } = require('../middleware/businessContext');

// Static categories route
router.get('/categories', getCategories);

// Workspace-protected transaction routes
router.use(requireBusinessContext);

router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.route('/:id')
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
