import React, { useEffect, useState } from 'react';
import { X, Printer, Building2, CheckCircle2, AlertTriangle, FileText, Calendar, IndianRupee } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { getDashboardData } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function SummaryModal() {
  const { isSummaryModalOpen, setIsSummaryModalOpen, business, refreshTrigger } = useBusiness();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSummaryModalOpen) {
      loadData();
    }
  }, [isSummaryModalOpen, refreshTrigger]);

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

  if (!isSummaryModalOpen) return null;

  const currentBusiness = data?.business || business;
  const financials = data?.financials || { totalIncome: 0, totalExpenses: 0, netIncome: 0 };
  const docs = data?.documentsReady || { ready: 0, total: 10, percentage: 0 };
  const filing = data?.filingProgress || { completed: 0, total: 17, percentage: 0 };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden print:border-none print:shadow-none print:max-w-none print:w-full print:max-h-none">
        {/* Modal Top Bar (hidden during print) */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-base">Tax Preparation Summary</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print / Download PDF</span>
              <span className="sm:hidden">Print</span>
            </button>
            <button
              onClick={() => setIsSummaryModalOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-5 sm:p-8 space-y-6 text-slate-800 overflow-y-auto flex-1 print:p-4 print:space-y-4 print:overflow-visible">
          {/* Header */}
          <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl sm:text-2xl font-bold text-slate-900">
                  {currentBusiness?.name || 'Small Business'}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {currentBusiness?.businessType || 'Retail'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Proprietor: <strong className="text-slate-700">{currentBusiness?.ownerName || 'Business Owner'}</strong>
                {currentBusiness?.city ? ` | Location: ${currentBusiness.city}` : ''}
              </p>
            </div>

            <div className="sm:text-right text-xs text-slate-500 space-y-0.5">
              <p className="font-semibold text-emerald-700 text-sm">EasyTax Preparation Summary</p>
              <p>Generated on: {formatDate(new Date())}</p>
              <p>Status: Preliminary Preparation</p>
            </div>
          </div>

          {/* Section 1: Business Information */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>1. Business Information</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
              <div>
                <p className="text-slate-500">Enterprise Name</p>
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
                <p className="text-slate-500">City / Jurisdiction</p>
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
                <p className="text-slate-500">Filing Period</p>
                <p className="font-semibold text-slate-800">FY 2024-25 (AY 2025-26)</p>
              </div>
            </div>
          </div>

          {/* Section 2: Financial Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              <span>2. Financial Summary (Sales & Expenses)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
                <p className="text-xs text-slate-500">Total Sales & Income</p>
                <p className="text-xl font-bold text-emerald-600 mt-1">
                  {formatCurrency(financials.totalIncome)}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">All sales and operating receipts</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
                <p className="text-xs text-slate-500">Total Business Expenses</p>
                <p className="text-xl font-bold text-rose-600 mt-1">
                  {formatCurrency(financials.totalExpenses)}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Stock, rent, bills, and wages</p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 shadow-2xs">
                <p className="text-xs text-emerald-800 font-medium">Net Business Profit</p>
                <p className="text-xl font-bold text-emerald-700 mt-1">
                  {formatCurrency(financials.netIncome)}
                </p>
                <p className="text-[11px] text-emerald-700/80 mt-1">Total Sales minus Expenses</p>
              </div>
            </div>
          </div>

          {/* Section 3: Preparation Status */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>3. Digital Readiness Status</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Document Readiness */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">Document Readiness</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {docs.ready} of {docs.total} Available ({docs.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${docs.percentage}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-500">
                  {docs.total - docs.ready === 0
                    ? 'All standard compliance documents marked available.'
                    : `${docs.total - docs.ready} document(s) still pending verification.`}
                </p>
              </div>

              {/* Checklist Progress */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">Filing Preparation Checklist</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {filing.completed} of {filing.total} Completed ({filing.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${filing.percentage}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-500">
                  {filing.completed >= filing.total
                    ? 'Complete digital preparation checklist completed.'
                    : 'Interactive steps to ensure books and documents are organized.'}
                </p>
              </div>
            </div>
          </div>

          {/* Educational Disclaimer Box */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-amber-950">Statutory Disclaimer:</strong> This summary document is generated strictly for tax preparation and personal record-keeping. EasyTax Support does not submit official returns to the Central Board of Direct Taxes (CBDT) or the Goods and Services Tax Network (GSTN). Please consult a licensed Chartered Accountant (CA) or tax professional for statutory filing.
              </div>
            </div>
          </div>

          {/* Signature / Presentation Block */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              <p>Prepared using: EasyTax Support</p>
              <p>Topic: Digital Tax Filing Support for Small Businesses</p>
            </div>
            <div className="text-right">
              <p className="border-b border-slate-400 w-36 mb-1 h-6"></p>
              <p>Authorized Signature / Date</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar (hidden during print) */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between no-print">
          <span className="text-xs text-slate-500">
            Click <strong>Print / Download PDF</strong> to generate physical or PDF copy for your viva presentation.
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSummaryModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-xl transition cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Summary</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
