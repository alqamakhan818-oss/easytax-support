import React, { useState, useEffect } from 'react';
import { X, ArrowDownRight, ArrowUpRight, Calendar, Tag, FileText, IndianRupee, Check } from 'lucide-react';
import { toInputDateFormat } from '../utils/formatters';

const DEFAULT_CATEGORIES = {
  income: [
    'Product Sales',
    'Service / Delivery',
    'Consulting / Freelance',
    'Commission & Referral',
    'Rental Income',
    'Other Income',
  ],
  expense: [
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
  ],
};

export default function TransactionModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  categories = DEFAULT_CATEGORIES,
}) {
  const [formData, setFormData] = useState({
    type: 'income',
    date: toInputDateFormat(),
    description: '',
    category: DEFAULT_CATEGORIES.income[0],
    amount: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || 'income',
        date: toInputDateFormat(initialData.date),
        description: initialData.description || '',
        category: initialData.category || (initialData.type === 'expense' ? DEFAULT_CATEGORIES.expense[0] : DEFAULT_CATEGORIES.income[0]),
        amount: initialData.amount !== undefined ? initialData.amount : '',
      });
    } else {
      setFormData({
        type: 'income',
        date: toInputDateFormat(),
        description: '',
        category: DEFAULT_CATEGORIES.income[0],
        amount: '',
      });
    }
    setErrorMsg('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleTypeChange = (newType) => {
    const defaultCat = categories[newType]?.[0] || (newType === 'income' ? 'Product Sales' : 'Inventory / Stock');
    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: defaultCat,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      setErrorMsg('Please enter a description');
      return;
    }

    const numAmount = Number(formData.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('Please enter a valid amount greater than 0');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      await onSubmit({
        ...formData,
        amount: numAmount,
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to save transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const availableCategories = categories[formData.type] || DEFAULT_CATEGORIES[formData.type];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <h3 className="font-semibold text-base text-white">
            {initialData ? 'Edit Transaction' : 'Record New Transaction'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {errorMsg && (
              <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg font-medium">
                {errorMsg}
              </div>
            )}

          {/* Type Toggle Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Transaction Type</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  formData.type === 'income'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>Income (Receipt)</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  formData.type === 'expense'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Expense (Payout)</span>
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Amount (₹) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g. 25000"
                min="1"
                step="any"
                required
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={formData.type === 'income' ? 'e.g. Mobile Accessories Sales' : 'e.g. Commercial Electricity Bill'}
                required
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden text-slate-800"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-white appearance-none text-slate-800"
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Transaction Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-white text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Sticky Actions Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50 ${
                formData.type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{submitting ? 'Saving...' : initialData ? 'Update Record' : 'Add Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
