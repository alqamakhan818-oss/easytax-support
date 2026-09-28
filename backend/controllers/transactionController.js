const Transaction = require('../models/Transaction');

const INCOME_CATEGORIES = [
  'Product Sales',
  'Service / Delivery',
  'Consulting / Freelance',
  'Commission & Referral',
  'Rental Income',
  'Other Income',
];

const EXPENSE_CATEGORIES = [
  'Inventory / Stock',
  'Rent',
  'Utilities',
  'Salaries / Wages',
  'Packaging & Supplies',
  'Marketing & Advertising',
  'Repairs & Maintenance',
  'Transportation & Logistics',
  'Software & Subscriptions',
  'Other Expenses',
];

// GET /api/transactions - Get transactions for current business workspace
const getTransactions = async (req, res, next) => {
  try {
    const { type, category, sort, search } = req.query;

    const filter = { businessId: req.businessId };
    if (type && ['income', 'expense'].includes(type.toLowerCase())) {
      filter.type = type.toLowerCase();
    }
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (search && search.trim() !== '') {
      filter.description = { $regex: search.trim(), $options: 'i' };
    }

    let sortOptions = { date: -1, createdAt: -1 };
    if (sort === 'date_asc') sortOptions = { date: 1, createdAt: 1 };
    if (sort === 'amount_desc') sortOptions = { amount: -1 };
    if (sort === 'amount_asc') sortOptions = { amount: 1 };

    const transactions = await Transaction.find(filter).sort(sortOptions);

    // Compute aggregate for current filter
    let incomeSum = 0;
    let expenseSum = 0;
    transactions.forEach((tx) => {
      if (tx.type === 'income') incomeSum += tx.amount;
      if (tx.type === 'expense') expenseSum += tx.amount;
    });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      totals: {
        totalIncome: incomeSum,
        totalExpenses: expenseSum,
        net: incomeSum - expenseSum,
      },
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/transactions - Create transaction for current business workspace
const createTransaction = async (req, res, next) => {
  try {
    const { type, category, description, amount, date } = req.body;

    if (!type || !['income', 'expense'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Valid transaction type ('income' or 'expense') is required",
      });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Description is required',
      });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number',
      });
    }

    const transaction = await Transaction.create({
      businessId: req.businessId,
      type,
      category: category.trim(),
      description: description.trim(),
      amount: numericAmount,
      date: date ? new Date(date) : new Date(),
    });

    return res.status(201).json({
      success: true,
      message: `${type === 'income' ? 'Income' : 'Expense'} record added successfully`,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/transactions/:id - Update transaction belonging to current business workspace
const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, category, description, amount, date } = req.body;

    const transaction = await Transaction.findOne({
      _id: id,
      businessId: req.businessId,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    if (type && !['income', 'expense'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Transaction type must be 'income' or 'expense'",
      });
    }

    if (amount !== undefined) {
      const num = Number(amount);
      if (isNaN(num) || num <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be greater than 0',
        });
      }
      transaction.amount = num;
    }

    if (type) transaction.type = type;
    if (category) transaction.category = category.trim();
    if (description) transaction.description = description.trim();
    if (date) transaction.date = new Date(date);

    const updated = await transaction.save();

    return res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/transactions/:id - Delete transaction belonging to current business workspace
const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      businessId: req.businessId,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      data: { id: transaction._id },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/transactions/categories
const getCategories = (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      income: INCOME_CATEGORIES,
      expense: EXPENSE_CATEGORIES,
    },
  });
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getCategories,
};
