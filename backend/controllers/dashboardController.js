const Business = require('../models/Business');
const Transaction = require('../models/Transaction');
const Checklist = require('../models/Checklist');
const DocumentStatus = require('../models/DocumentStatus');
const { defaultChecklistItems } = require('../utils/seedData');

// GET /api/dashboard
const getDashboardSummary = async (req, res, next) => {
  try {
    const business = (await Business.findOne()) || {
      name: 'My Small Business',
      ownerName: 'Business Owner',
      businessType: 'Retail',
    };

    // Calculate income and expense aggregates
    const transactions = await Transaction.find().sort({ date: -1 });

    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryBreakdown = {
      income: {},
      expense: {},
    };

    // Track monthly aggregates
    const monthlyMap = {};

    transactions.forEach((tx) => {
      const amount = Number(tx.amount) || 0;
      const d = new Date(tx.date);
      const monthYear = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });

      if (!monthlyMap[monthYear]) {
        monthlyMap[monthYear] = { month: monthYear, income: 0, expenses: 0, sortKey: d.getTime() };
      }

      if (tx.type === 'income') {
        totalIncome += amount;
        monthlyMap[monthYear].income += amount;
        categoryBreakdown.income[tx.category] = (categoryBreakdown.income[tx.category] || 0) + amount;
      } else if (tx.type === 'expense') {
        totalExpenses += amount;
        monthlyMap[monthYear].expenses += amount;
        categoryBreakdown.expense[tx.category] = (categoryBreakdown.expense[tx.category] || 0) + amount;
      }
    });

    const netIncome = totalIncome - totalExpenses;

    // Convert monthly map to sorted array
    const monthlyData = Object.values(monthlyMap)
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ month, income, expenses }) => ({
        month,
        income,
        expenses,
        net: income - expenses,
      }));

    // If transactions are few or single month, ensure chart looks great
    if (monthlyData.length === 0) {
      monthlyData.push({ month: 'Current Period', income: 0, expenses: 0, net: 0 });
    }

    // Documents status
    const docDoc = await DocumentStatus.findOne();
    const docList = docDoc && docDoc.documents ? docDoc.documents : [];
    const totalDocs = docList.length;
    const availableDocs = docList.filter((d) => d.status === 'Available').length;
    const documentsReady = {
      ready: availableDocs,
      total: totalDocs,
      percentage: totalDocs > 0 ? Math.round((availableDocs / totalDocs) * 100) : 0,
    };

    // Checklist progress
    const checklistDoc = await Checklist.findOne();
    const completedItems = checklistDoc && checklistDoc.completedItems ? checklistDoc.completedItems : [];
    const totalChecklist = defaultChecklistItems.length;
    const completedCount = completedItems.length;
    const filingProgress = {
      completed: completedCount,
      total: totalChecklist,
      percentage: totalChecklist > 0 ? Math.round((completedCount / totalChecklist) * 100) : 0,
    };

    // Recent 5 transactions
    const recentTransactions = transactions.slice(0, 5);

    return res.status(200).json({
      success: true,
      data: {
        business,
        financials: {
          totalIncome,
          totalExpenses,
          netIncome,
        },
        documentsReady,
        filingProgress,
        monthlyData,
        categoryBreakdown,
        recentTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
};
