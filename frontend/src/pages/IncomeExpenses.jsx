import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown, 
  Edit2, 
  Trash2, 
  RotateCcw,
  IndianRupee,
  Calendar,
  AlertCircle,
  Download
} from 'lucide-react';
import { 
  getTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction, 
  getTransactionCategories 
} from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import TransactionModal from '../components/TransactionModal';
import { useBusiness } from '../context/BusinessContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function IncomeExpenses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { triggerGlobalRefresh } = useBusiness();

  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({ totalIncome: 0, totalExpenses: 0, net: 0 });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState({ income: [], expense: [] });

  // Filters & Sorting state
  const typeParam = searchParams.get('type') || 'all';
  const [typeFilter, setTypeFilter] = useState(typeParam);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date_desc');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [typeFilter, categoryFilter, sortBy, searchQuery]);

  const loadCategories = async () => {
    try {
      const res = await getTransactionCategories();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (typeFilter !== 'all') params.type = typeFilter;
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (sortBy) params.sort = sortBy;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await getTransactions(params);
      if (res.success) {
        setTransactions(res.data || []);
        setTotals(res.totals || { totalIncome: 0, totalExpenses: 0, net: 0 });
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeTabChange = (type) => {
    setTypeFilter(type);
    setCategoryFilter('All');
    if (type === 'all') {
      searchParams.delete('type');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ type });
    }
  };

  const handleAddSubmit = async (formData) => {
    await createTransaction(formData);
    loadTransactions();
    triggerGlobalRefresh();
  };

  const handleEditSubmit = async (formData) => {
    if (!editingTransaction) return;
    await updateTransaction(editingTransaction._id, formData);
    setEditingTransaction(null);
    loadTransactions();
    triggerGlobalRefresh();
  };

  const handleDelete = async (id, description) => {
    if (window.confirm(`Are you sure you want to delete the transaction "${description}"?`)) {
      try {
        await deleteTransaction(id);
        loadTransactions();
        triggerGlobalRefresh();
      } catch (err) {
        alert('Failed to delete transaction: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleExportCSV = () => {
    if (!transactions || transactions.length === 0) {
      alert('No transactions available to export.');
      return;
    }

    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount (INR)'];
    const rows = transactions.map((t) => [
      `"${formatDate(t.date)}"`,
      `"${t.type.toUpperCase()}"`,
      `"${(t.category || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.amount
    ]);

    const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `easytax_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentAvailableCategories =
    typeFilter === 'income'
      ? categories.income
      : typeFilter === 'expense'
      ? categories.expense
      : [...new Set([...(categories.income || []), ...(categories.expense || [])])];

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Disclaimer */}
      <DisclaimerBanner compact />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales & Expenses</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Record your daily shop sales and business bills in simple steps
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 px-3.5 py-2.5 rounded-xl transition cursor-pointer shadow-2xs"
            title="Download spreadsheet of current records"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Entry</span>
          </button>
        </div>
      </div>

      {/* Summary Totals Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
          <div className="p-2.5 bg-emerald-600 text-white rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-800">Total Sales</p>
            <p className="text-lg font-bold text-emerald-700">{formatCurrency(totals.totalIncome)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50/60 border border-rose-100">
          <div className="p-2.5 bg-rose-600 text-white rounded-lg">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-rose-800">Total Expenses</p>
            <p className="text-lg font-bold text-rose-700">{formatCurrency(totals.totalExpenses)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="p-2.5 bg-slate-800 text-white rounded-lg">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-600">Net Profit (Sales minus Expenses)</p>
            <p className={`text-lg font-bold ${totals.net >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
              {formatCurrency(totals.net)}
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Type Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl max-w-sm">
            <button
              onClick={() => handleTypeTabChange('all')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => handleTypeTabChange('income')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
                typeFilter === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Sales
            </button>
            <button
              onClick={() => handleTypeTabChange('expense')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
                typeFilter === 'expense'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-rose-700'
              }`}
            >
              Expenses
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search description..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-1.5 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white text-slate-700"
            >
              <option value="All">All Categories</option>
              {currentAvailableCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1.5 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white text-slate-700"
            >
              <option value="date_desc">Newest Date First</option>
              <option value="date_asc">Oldest Date First</option>
              <option value="amount_desc">Highest Amount</option>
              <option value="amount_asc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No transactions match your filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Try adjusting your search criteria or record a new transaction to populate your ledger.
            </p>
            <button
              onClick={() => {
                setTypeFilter('all');
                setCategoryFilter('All');
                setSearchQuery('');
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          <div>
            {/* Mobile View Cards (screens < 640px) */}
            <div className="sm:hidden divide-y divide-slate-100">
              {transactions.map((tx) => (
                <div key={tx._id} className="p-4 space-y-2 hover:bg-slate-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {tx.type === 'income' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <TrendingUp className="w-3 h-3" /> Income
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <TrendingDown className="w-3 h-3" /> Expense
                        </span>
                      )}
                      <span className="text-xs text-slate-400">{formatDate(tx.date)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingTransaction(tx)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        title="Edit transaction"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tx._id, tx.description)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-slate-800">{tx.description}</p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-md">
                      {tx.category}
                    </span>
                    <span className={`text-base font-extrabold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (screens >= 640px) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {tx.type === 'income' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                            <TrendingUp className="w-3 h-3" /> Income
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/50">
                            <TrendingDown className="w-3 h-3" /> Expense
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {tx.description}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-medium">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold whitespace-nowrap">
                        <span className={tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}>
                          {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setEditingTransaction(tx)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                            title="Edit transaction"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(tx._id, tx.description)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Delete transaction"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        categories={categories}
      />

      {/* Edit Transaction Modal */}
      <TransactionModal
        isOpen={Boolean(editingTransaction)}
        onClose={() => setEditingTransaction(null)}
        onSubmit={handleEditSubmit}
        initialData={editingTransaction}
        categories={categories}
      />
    </div>
  );
}
