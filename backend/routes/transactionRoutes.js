const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getCategories,
} = require('../controllers/transactionController');

router.get('/categories', getCategories);

router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.route('/:id')
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
