import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Printer, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  IndianRupee, 
  ArrowLeft 
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { getDashboardData } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function SummaryPage() {
  const { business, refreshTrigger } = useBusiness();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getDashboardData();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load summary data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentBusiness = data?.business || business;
  const financials = data?.financials || { totalIncome: 0, totalExpenses: 0, netIncome: 0 };
  const docs = data?.documentsReady || { ready: 0, total: 10, percentage: 0 };
  const filing = data?.filingProgress || { completed: 0, total: 17, percentage: 0 };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500 font-medium">Generating preparation summary report...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Action Bar (hidden on print) */}
      <div className="flex items-center justify-between no-print">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 px-3.5 py-2 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      <div className="no-print">
        <DisclaimerBanner compact />
      </div>

      {/* Main Printable Document */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-8 print:p-0 print:border-none print:shadow-none">
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {currentBusiness?.name || 'Small Business'}
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {currentBusiness?.businessType || 'Retail'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Proprietor: <strong className="text-slate-800">{currentBusiness?.ownerName || 'Business Owner'}</strong>
              {currentBusiness?.city ? ` | Location: ${currentBusiness.city}` : ''}
            </p>
          </div>

          <div className="sm:text-right text-xs text-slate-500 space-y-0.5">
            <span className="inline-block font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md text-xs mb-1">
              Digital Tax Preparation Summary
            </span>
            <p>Generated on: {formatDate(new Date())}</p>
            <p>Assessment Reference: AY 2025-26 (FY 2024-25)</p>
          </div>
        </div>

        {/* 1. Business Profile Information */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>1. Enterprise Information</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
            <div>
              <p className="text-slate-500">Trade Name</p>
              <p className="font-semibold text-slate-800">{currentBusiness?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-500">Proprietor Name</p>
              <p className="font-semibold text-slate-800">{currentBusiness?.ownerName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-500">Business Segment</p>
              <p className="font-semibold text-slate-800">{currentBusiness?.businessType || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-500">Jurisdiction / City</p>
              <p className="font-semibold text-slate-800">{currentBusiness?.city || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-slate-500">Contact Email</p>
              <p className="font-semibold text-slate-800">{currentBusiness?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-500">Contact Phone</p>
              <p className="font-semibold text-slate-800">{currentBusiness?.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-500">Commencement Date</p>
              <p className="font-semibold text-slate-800">{formatDate(currentBusiness?.businessStartDate) || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-500">Account Type</p>
              <p className="font-semibold text-slate-800">Sole Proprietorship</p>
            </div>
          </div>
        </section>

        {/* 2. Financial Summary */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            <span>2. Financial Summary (Sales & Expenses)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <p className="text-xs text-slate-500">Total Sales & Income</p>
              <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(financials.totalIncome)}</p>
              <p className="text-[11px] text-slate-400 mt-1">Total revenue and sales deposits</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <p className="text-xs text-slate-500">Total Business Expenses</p>
              <p className="text-xl font-bold text-rose-600 mt-1">{formatCurrency(financials.totalExpenses)}</p>
              <p className="text-[11px] text-slate-400 mt-1">Stock, rent, bills, and wages</p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <p className="text-xs text-emerald-800 font-medium">Net Business Profit</p>
              <p className="text-xl font-bold text-emerald-700 mt-1">{formatCurrency(financials.netIncome)}</p>
              <p className="text-[11px] text-emerald-700/80 mt-1">Total Sales minus Expenses</p>
            </div>
          </div>
        </section>

        {/* 3. Digital Readiness Status */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>3. Digital Readiness Status</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">Document Readiness</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {docs.ready} of {docs.total} Available ({docs.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full"
                  style={{ width: `${docs.percentage}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500">
                {docs.total - docs.ready === 0
                  ? 'All standard compliance documents marked available.'
                  : `${docs.total - docs.ready} document(s) pending physical or digital collection.`}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">Filing Preparation Checklist</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {filing.completed} of {filing.total} Completed ({filing.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full"
                  style={{ width: `${filing.percentage}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500">
                {filing.completed >= filing.total
                  ? 'Complete digital preparation checklist completed.'
                  : 'Structured compliance tasks completed in preparation for statutory review.'}
              </p>
            </div>
          </div>
        </section>

        {/* 4. Statutory & Academic Disclaimer */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs leading-relaxed">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-amber-950">Statutory Notice: </strong>
              This summary is generated strictly for tax preparation and personal record-keeping. EasyTax Support does NOT submit returns to the Central Board of Direct Taxes (CBDT) or the Goods and Services Tax Network (GSTN). Please consult a licensed Chartered Accountant (CA) or tax professional for statutory filing.
            </div>
          </div>
        </div>

        {/* Signature & Verification Block */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <p className="font-semibold text-slate-700">EasyTax Support</p>
            <p>Topic: Digital Tax Filing Support for Small Businesses</p>
          </div>
          <div className="text-right">
            <div className="border-b border-slate-400 w-44 mb-1 h-8"></div>
            <p>Proprietor Signature / Date</p>
          </div>
        </div>
      </div>
    </div>
  );
}
