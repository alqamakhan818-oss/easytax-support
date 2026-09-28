import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  FolderCheck, 
  ListChecks, 
  PlusCircle, 
  Building2, 
  ArrowRight, 
  Edit3, 
  Printer, 
  CheckCircle2, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { getDashboardData, createTransaction } from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import TransactionModal from '../components/TransactionModal';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function Dashboard() {
  const { business, setIsProfileModalOpen, setIsSummaryModalOpen, refreshTrigger, triggerGlobalRefresh } = useBusiness();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, [refreshTrigger]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getDashboardData();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
      setError('Failed to load dashboard data. Ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTx = async (txData) => {
    await createTransaction(txData);
    triggerGlobalRefresh();
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500 font-medium">Loading financial dashboard...</p>
      </div>
    );
  }

  const financials = data?.financials || { totalIncome: 0, totalExpenses: 0, netIncome: 0 };
  const docs = data?.documentsReady || { ready: 0, total: 10, percentage: 0 };
  const filing = data?.filingProgress || { completed: 0, total: 17, percentage: 0 };
  const currentBiz = data?.business || business;
  const monthlyData = data?.monthlyData || [];
  const recentTransactions = data?.recentTransactions || [];
  const categoryBreakdown = data?.categoryBreakdown || { income: {}, expense: {} };

  const topIncomeCategories = Object.entries(categoryBreakdown.income || {})
    .sort((a, b) => b[1] - a[1]);
  const topExpenseCategories = Object.entries(categoryBreakdown.expense || {})
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Disclaimer */}
      <DisclaimerBanner compact />

      {/* Profile Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {currentBiz?.name || 'My Business'}
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {currentBiz?.businessType || 'Retail'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Proprietor: <span className="font-medium text-slate-700">{currentBiz?.ownerName || 'Business Owner'}</span>
              {currentBiz?.city ? ` • ${currentBiz.city}` : ''}
              {currentBiz?.businessStartDate ? ` • Operating since ${formatDate(currentBiz.businessStartDate)}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={() => setIsAddTxModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Transaction</span>
          </button>
          <button
            onClick={() => setIsSummaryModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Summary</span>
          </button>
        </div>
      </div>

      {/* 5 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Income */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider truncate">Total Sales & Income</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-bold text-emerald-600 tracking-tight truncate">
              {formatCurrency(financials.totalIncome)}
            </div>
            <p className="text-xs text-slate-500 mt-1 truncate">Total sales and receipts</p>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider truncate">Total Expenses</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl shrink-0">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-bold text-rose-600 tracking-tight truncate">
              {formatCurrency(financials.totalExpenses)}
            </div>
            <p className="text-xs text-slate-500 mt-1 truncate">Stock, rent, bills, wages</p>
          </div>
        </div>

        {/* Net Income */}
        <div className="bg-white rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 shadow-xs flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider truncate">Net Profit</span>
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-xl sm:text-2xl font-bold tracking-tight truncate ${financials.netIncome >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
              {formatCurrency(financials.netIncome)}
            </div>
            <p className="text-xs text-emerald-700/80 mt-1 truncate">Total Sales minus Expenses</p>
          </div>
        </div>

        {/* Documents Ready */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider truncate">Required Documents</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
              <FolderCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-bold text-slate-900">{docs.ready}</span>
              <span className="text-sm text-slate-400">/ {docs.total}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${docs.percentage}%` }}></div>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">{docs.percentage}% documents ready</p>
          </div>
        </div>

        {/* Filing Progress */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between min-w-0 sm:col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider truncate">Tax Checklist</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl shrink-0">
              <ListChecks className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-bold text-slate-900">{filing.completed}</span>
              <span className="text-sm text-slate-400">/ {filing.total}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${filing.percentage}%` }}></div>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">{filing.percentage}% steps done</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
        {/* Income vs Expenses Chart (Recharts) */}
        <div className="lg:col-span-2 min-w-0 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Sales vs Expenses Chart</h2>
              <p className="text-xs text-slate-500">Month-by-month view of your business income and spending</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium self-start sm:self-auto">
              Simplified Visualizer
            </span>
          </div>

          <div className="h-72 w-full pt-2 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), '']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="income" name="Income (₹)" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={48} />
                <Bar dataKey="expenses" name="Expenses (₹)" fill="#e11d48" radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Tax Estimate Callout */}
        <div className="space-y-6">
          {/* Estimated Taxable Income Teaser */}
          <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                Tax Estimate
              </span>
              <h3 className="text-xl font-bold">Estimated Taxable Profit</h3>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Your estimated profit is total sales minus business expenses. Open the estimator to view your tax bracket.
              </p>
            </div>

            <div className="pt-4 border-t border-emerald-600/60 mt-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-200">Net Business Profit</span>
                <p className="text-xl font-bold">{formatCurrency(financials.netIncome)}</p>
              </div>
              <Link
                to="/estimator"
                className="bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold px-3.5 py-2 rounded-xl transition"
              >
                Open Estimator →
              </Link>
            </div>
          </div>

          {/* Quick Action Links */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/checklist"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition border border-slate-100"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-slate-800">Tax Steps Checklist</span>
                </div>
                <span className="text-xs text-slate-500">{filing.completed}/{filing.total}</span>
              </Link>

              <Link
                to="/documents"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition border border-slate-100"
              >
                <div className="flex items-center gap-2.5">
                  <FolderCheck className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-slate-800">Required Documents</span>
                </div>
                <span className="text-xs text-slate-500">{docs.ready}/{docs.total}</span>
              </Link>

              <Link
                to="/learn"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition border border-slate-100"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-semibold text-slate-800">Tax Guide & Key Dates</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Sources */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sales by Category</h3>
              <p className="text-xs text-slate-500">Counter sales, services, and other income</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              {formatCurrency(financials.totalIncome)}
            </span>
          </div>

          {topIncomeCategories.length === 0 ? (
            <p className="text-xs text-slate-400 py-3">No income records available.</p>
          ) : (
            <div className="space-y-3">
              {topIncomeCategories.map(([cat, amount]) => {
                const pct = financials.totalIncome > 0 ? Math.round((amount / financials.totalIncome) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700">{cat}</span>
                      <span className="font-bold text-slate-900">{formatCurrency(amount)} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Expense Drivers */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Expenses by Category</h3>
              <p className="text-xs text-slate-500">Inventory, rent, utilities, and helper wages</p>
            </div>
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md">
              {formatCurrency(financials.totalExpenses)}
            </span>
          </div>

          {topExpenseCategories.length === 0 ? (
            <p className="text-xs text-slate-400 py-3">No expenses recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {topExpenseCategories.map(([cat, amount]) => {
                const pct = financials.totalExpenses > 0 ? Math.round((amount / financials.totalExpenses) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700">{cat}</span>
                      <span className="font-bold text-slate-900">{formatCurrency(amount)} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Recent Transactions</h2>
            <p className="text-xs text-slate-500">Latest entries recorded in your books</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddTxModalOpen(true)}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              + Add Entry
            </button>
            <Link
              to="/transactions"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
            >
              View Full Record →
            </Link>
          </div>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            <p>No transactions recorded yet.</p>
            <button
              onClick={() => setIsAddTxModalOpen(true)}
              className="mt-2 text-xs text-emerald-600 font-semibold hover:underline cursor-pointer"
            >
              Record your first sale or expense
            </button>
          </div>
        ) : (
          <div>
            {/* Mobile View (< 640px) */}
            <div className="sm:hidden divide-y divide-slate-100">
              {recentTransactions.map((tx) => (
                <div key={tx._id} className="py-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {tx.type === 'income' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <TrendingUp className="w-2.5 h-2.5" /> Income
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <TrendingDown className="w-2.5 h-2.5" /> Expense
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">{formatDate(tx.date)}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {tx.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-800 truncate max-w-[200px]">{tx.description}</p>
                    <span className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= 640px) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="pb-3 pl-1">Date</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Description</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3 pr-1 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentTransactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 pl-1 text-slate-600 whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>
                      <td className="py-3 whitespace-nowrap">
                        {tx.type === 'income' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <TrendingUp className="w-3 h-3" /> Income
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                            <TrendingDown className="w-3 h-3" /> Expense
                          </span>
                        )}
                      </td>
                      <td className="py-3 font-medium text-slate-800 max-w-xs truncate">
                        {tx.description}
                      </td>
                      <td className="py-3 text-slate-600 whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-md">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-3 pr-1 text-right font-bold whitespace-nowrap">
                        <span className={tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}>
                          {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      <TransactionModal
        isOpen={isAddTxModalOpen}
        onClose={() => setIsAddTxModalOpen(false)}
        onSubmit={handleCreateTx}
      />
    </div>
  );
}
