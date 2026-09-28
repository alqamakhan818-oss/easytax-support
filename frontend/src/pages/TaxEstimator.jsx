import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  HelpCircle, 
  Info, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  FileCheck2, 
  RotateCcw,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { getDashboardData } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { useBusiness } from '../context/BusinessContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function TaxEstimator() {
  const { business, setIsSummaryModalOpen } = useBusiness();
  const [loading, setLoading] = useState(true);

  // Financial inputs synced from transactions or custom-editable for testing
  const [grossIncome, setGrossIncome] = useState(0);
  const [businessExpenses, setBusinessExpenses] = useState(0);

  // Optional Other Eligible Deductions
  const [deductions80C, setDeductions80C] = useState(0); // Life insurance, PPF, ELSS, EPF
  const [deductions80D, setDeductions80D] = useState(0); // Health insurance premium
  const [otherDeductions, setOtherDeductions] = useState(0); // Other eligible personal/business deductions

  const [useRecordedData, setUseRecordedData] = useState(true);
  const [recordedTotals, setRecordedTotals] = useState({ income: 0, expenses: 0 });
  const [regime, setRegime] = useState('new'); // 'new' (Sec 115BAC, default) | 'old' (with deductions)

  useEffect(() => {
    loadRecordedData();
  }, []);

  const loadRecordedData = async () => {
    try {
      setLoading(true);
      const res = await getDashboardData();
      if (res.success && res.data?.financials) {
        const inc = res.data.financials.totalIncome || 0;
        const exp = res.data.financials.totalExpenses || 0;
        setRecordedTotals({ income: inc, expenses: exp });
        setGrossIncome(inc);
        setBusinessExpenses(exp);
      }
    } catch (err) {
      console.error('Failed to load recorded data for estimator:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSync = (checked) => {
    setUseRecordedData(checked);
    if (checked) {
      setGrossIncome(recordedTotals.income);
      setBusinessExpenses(recordedTotals.expenses);
    }
  };

  const handleResetDefaults = () => {
    setGrossIncome(recordedTotals.income);
    setBusinessExpenses(recordedTotals.expenses);
    setDeductions80C(0);
    setDeductions80D(0);
    setOtherDeductions(0);
    setRegime('new');
    setUseRecordedData(true);
  };

  // Calculations
  const netBusinessIncome = Math.max(0, grossIncome - businessExpenses);
  const totalEligibleDeductions = deductions80C + deductions80D + otherDeductions;
  const effectiveDeductions = regime === 'new' ? 0 : totalEligibleDeductions;
  const estimatedTaxableIncome = Math.max(0, netBusinessIncome - effectiveDeductions);

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Educational Tax Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Page Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tax Estimator</h1>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Illustrative Estimate
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Educational calculation of Estimated Taxable Income for small businesses (Applicable FY 2024-25 / AY 2025-26)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-300 px-3.5 py-2 rounded-xl transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Inputs</span>
          </button>
          <button
            onClick={() => setIsSummaryModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition shadow-xs cursor-pointer"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>View Summary</span>
          </button>
        </div>
      </div>

      {/* Main Calculation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-600" />
                <span>Enter Your Business Numbers</span>
              </h2>
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useRecordedData}
                  onChange={(e) => handleToggleSync(e.target.checked)}
                  className="rounded-sm border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span>Auto-fill from Your Recorded Entries</span>
              </label>
            </div>

            {/* Tax Regime Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Choose Tax Option (New vs Old)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRegime('new')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer text-left sm:text-center ${
                    regime === 'new'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <div>New Tax Regime (Section 115BAC)</div>
                  <div className={`text-[10px] font-normal ${regime === 'new' ? 'text-emerald-100' : 'text-slate-500'}`}>
                    Default • Lower tax rates, zero tax up to ₹7 Lakhs, no 80C deductions
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setRegime('old')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer text-left sm:text-center ${
                    regime === 'old'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <div>Old Tax Regime</div>
                  <div className={`text-[10px] font-normal ${regime === 'old' ? 'text-emerald-100' : 'text-slate-500'}`}>
                    Allows tax savings on LIC, PPF (80C), Mediclaim (80D)
                  </div>
                </button>
              </div>
            </div>

            {/* Income Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Total Sales / Customer Receipts (₹)
                </label>
                <span className="text-xs text-emerald-600 font-medium">All sales and income</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  value={grossIncome}
                  onChange={(e) => {
                    setUseRecordedData(false);
                    setGrossIncome(Math.max(0, Number(e.target.value) || 0));
                  }}
                  min="0"
                  step="1000"
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Expense Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Total Business Expenses (₹)
                </label>
                <span className="text-xs text-rose-600 font-medium">Stock purchases, rent, bills, wages</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  value={businessExpenses}
                  onChange={(e) => {
                    setUseRecordedData(false);
                    setBusinessExpenses(Math.max(0, Number(e.target.value) || 0));
                  }}
                  min="0"
                  step="1000"
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Optional Other Eligible Deductions Section */}
            <div className="pt-3 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Optional Other Eligible Deductions
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Applicable under Old Regime (disallowed under New Regime u/s 115BAC)
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                  {formatCurrency(totalEligibleDeductions)}
                </span>
              </div>

              {/* Educational Regime Alert for Deductions */}
              {regime === 'new' ? (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-950">New Regime Note:</span>{' '}
                    <span>
                      Personal deductions (LIC, PPF, Mediclaim) are not allowed under the New Tax Regime. Instead, tax rates are lower and profits up to ₹7 Lakhs have zero tax. Switch to <strong>Old Tax Regime</strong> above to apply deductions.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-emerald-950">Old Regime Deductions Active:</span>{' '}
                    <span>
                      Eligible savings below (LIC, PPF, health insurance) will be subtracted from your business profit.
                    </span>
                  </div>
                </div>
              )}

              {/* 80C */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-700">
                    Section 80C (LIC, PPF, EPF, Children Fees) [Max ₹1,50,000]
                  </label>
                  <span className="text-[11px] text-slate-400">{formatCurrency(deductions80C)}</span>
                </div>
                <input
                  type="number"
                  value={deductions80C}
                  onChange={(e) => setDeductions80C(Math.min(150000, Math.max(0, Number(e.target.value) || 0)))}
                  placeholder="0"
                  min="0"
                  max="150000"
                  step="5000"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              {/* 80D */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-700">
                    Section 80D (Health Insurance / Mediclaim)
                  </label>
                  <span className="text-[11px] text-slate-400">{formatCurrency(deductions80D)}</span>
                </div>
                <input
                  type="number"
                  value={deductions80D}
                  onChange={(e) => setDeductions80D(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="0"
                  min="0"
                  step="2000"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              {/* Other Deductions */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-700">
                    Other Deductions (Donations, Education Loan Interest)
                  </label>
                  <span className="text-[11px] text-slate-400">{formatCurrency(otherDeductions)}</span>
                </div>
                <input
                  type="number"
                  value={otherDeductions}
                  onChange={(e) => setOtherDeductions(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="0"
                  min="0"
                  step="2000"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Educational Breakdown Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Step-by-Step Calculation</span>
              <span className="text-xs text-emerald-600 font-semibold lowercase">simple steps</span>
            </h3>

            {/* Formula Step 1: Gross Income */}
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="font-semibold text-slate-800">Total Recorded Sales</p>
                <p className="text-xs text-slate-400">All customer income</p>
              </div>
              <p className="font-bold text-slate-800">{formatCurrency(grossIncome)}</p>
            </div>

            {/* Formula Step 2: Less Expenses */}
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="font-semibold text-rose-600">Less: Business Expenses</p>
                <p className="text-xs text-slate-400">Stock, shop rent, electricity, wages</p>
              </div>
              <p className="font-bold text-rose-600">- {formatCurrency(businessExpenses)}</p>
            </div>

            <div className="border-t border-dashed border-slate-200 my-1"></div>

            {/* Formula Step 3: Estimated Net Income */}
            <div className="flex items-center justify-between text-sm bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <p className="font-bold text-slate-900">Net Business Profit</p>
                <p className="text-[11px] text-slate-500">Sales minus Business Expenses</p>
              </div>
              <p className="text-base font-extrabold text-slate-900">{formatCurrency(netBusinessIncome)}</p>
            </div>

            {/* Formula Step 4: Less Other Deductions */}
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="font-semibold text-slate-700">
                  Less: Personal Deductions ({regime === 'new' ? 'New Regime' : 'Old Regime'})
                </p>
                <p className="text-xs text-slate-400">
                  {regime === 'new' ? 'Not deducted in New Regime' : 'LIC, PPF, Mediclaim'}
                </p>
              </div>
              <p className="font-bold text-slate-600">
                {regime === 'new' ? '₹0' : `- ${formatCurrency(totalEligibleDeductions)}`}
              </p>
            </div>

            {/* Final Result Card */}
            <div className="bg-emerald-600 text-white p-5 rounded-2xl shadow-sm space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-emerald-200 font-bold">
                Final Result (Illustrative)
              </span>
              <p className="text-xs text-emerald-100">Estimated Taxable Income</p>
              <div className="text-3xl font-extrabold text-white tracking-tight pt-1">
                {formatCurrency(estimatedTaxableIncome)}
              </div>
              <p className="text-[11px] text-emerald-100/90 pt-1">
                This is the net amount upon which statutory tax slabs are typically calculated.
              </p>
            </div>

            {/* Educational Disclaimer Callout */}
            <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-semibold text-amber-950">Educational Focus:</strong>
                <p className="text-amber-800 leading-relaxed text-[11px]">
                  Under Indian Tax Law (Finance Acts), individuals and micro-enterprises can choose between the <strong>New Tax Regime (Section 115BAC)</strong> and the <strong>Old Tax Regime</strong>, or opt for <strong>Presumptive Taxation (Section 44AD/44ADA)</strong> where income is deemed as 6% or 8% of turnover. Always consult a licensed Chartered Accountant to determine your optimal tax filing strategy.
                </p>
              </div>
            </div>
          </div>

          {/* Section 44AD Scheme for Small Shops */}
          <div className="bg-white p-6 rounded-2xl border border-blue-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Easy Tax for Small Shops (Section 44AD)</h3>
                  <p className="text-xs text-slate-500">Government scheme for small retailers without heavy bookkeeping</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Optional Scheme
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium">Digital Sales (6% profit)</span>
                <p className="text-base font-extrabold text-slate-800 mt-1">
                  {formatCurrency(grossIncome * 0.06)}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">UPI, QR code, bank transfers</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium">Cash Sales (8% profit)</span>
                <p className="text-base font-extrabold text-slate-800 mt-1">
                  {formatCurrency(grossIncome * 0.08)}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Counter cash transactions</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Under Section 44AD, small retailers with turnover up to ₹2–3 Crore do not need full accounting books or audit. You can declare 6% (digital sales) or 8% (cash sales) of your turnover as your profit.
            </p>
          </div>
        </div>
      </div>

      {/* Educational Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
            01
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Turnover vs Net Profit</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Turnover is your total sales. Tax is never calculated on total sales; it is only calculated on your <strong>Net Profit</strong> after subtracting shop rent, stock costs, bills, and helper wages.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
            02
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Valid Shop Expenses</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every cost paid to run your shop is deductible: wholesale stock, shop rent, electricity, packaging, and wages. Always keep your purchase receipts safely.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
            03
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Small Shop Scheme (44AD)</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            For small retailers with turnover up to ₹2–3 Crore, Section 44AD allows declaring 6% on digital sales or 8% on cash sales as profit without hiring a full-time accountant.
          </p>
        </div>
      </div>
    </div>
  );
}
