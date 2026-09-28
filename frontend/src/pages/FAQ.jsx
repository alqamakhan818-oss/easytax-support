import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  Printer, 
  FileCheck2, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { useBusiness } from '../context/BusinessContext';

const FAQS = [
  {
    question: 'Can EasyTax Support file my taxes directly with the government?',
    answer:
      'No. EasyTax Support is strictly a tax-preparation assistance and educational tool. It does NOT connect to CBDT/Income Tax or GSTN servers and does not file official statutory tax returns. Its purpose is to help small enterprise proprietors organize their bills, compute illustrative taxable income, maintain document checklists, and generate a structured summary to hand over to a licensed Chartered Accountant (CA) or tax professional.',
    highlight: true,
  },
  {
    question: 'What is digital tax filing?',
    answer:
      'Digital tax filing (e-filing) is the statutory process of submitting your financial accounts, income statements, and tax computations electronically through official government portals (such as incometax.gov.in and gst.gov.in) rather than submitting physical paper forms at a tax office. It offers instant verification, faster processing of refunds, and secure permanent digital acknowledgements (like ITR-V).',
  },
  {
    question: 'Why should small businesses maintain regular financial records?',
    answer:
      'Maintaining an up-to-date ledger of daily sales and business expenses provides clarity on actual cash flow and profit margins. From a compliance perspective, organized records ensure you claim all allowable business deductions (reducing tax liability), prevent unexpected penalties during scrutiny, and facilitate effortless bank loan approvals.',
  },
  {
    question: 'What is GST and does every small business need to register?',
    answer:
      'Goods and Services Tax (GST) is a nationwide destination-based indirect tax. For intra-state (within the same state) supply of goods, small business owners generally do not need to register if their annual turnover is under ₹40 Lakhs (or ₹20 Lakhs for services/special category states). However, registration is mandatory if you engage in inter-state sales or e-commerce.',
  },
  {
    question: 'What is an Income Tax Return (ITR)?',
    answer:
      'An Income Tax Return is an annual formal filing where a taxpayer declares all income earned during a Financial Year, claims eligible business expenses and tax deductions, details taxes paid in advance or via TDS, and calculates any final balance due or refund payable.',
  },
  {
    question: 'What is the difference between Turnover and Taxable Income?',
    answer:
      'Turnover is the total gross money received from all sales and services without subtracting any expenses. Taxable Income is the net profit remaining after subtracting allowable business expenditures (stock purchases, rent, employee wages, utilities) and personal statutory deductions (like 80C/80D) from your gross turnover. Income tax is calculated only on Taxable Income, never on total turnover.',
  },
  {
    question: 'Why are purchase and sales invoices so important for small shops?',
    answer:
      'Invoices serve as legally binding commercial evidence. If tax authorities review your accounts, only business expenses supported by valid vendor invoices or receipts can be deducted. If you do not have invoices for stock purchases, the tax department may disallow those costs, artificially inflating your taxable profit.',
  },
  {
    question: 'What essential documents should a small business keep organized?',
    answer:
      'At minimum, every proprietor should preserve: (1) PAN card and MSME/Trade licenses, (2) Consecutive 12-month bank statements for all business accounts, (3) Numbered sales bills or daily cash memos, (4) Invoices for all supplier purchases, (5) Receipts for operating expenses (rent, electricity, repairs), (6) Previous year ITR acknowledgements, and (7) Form 26AS / AIS reports.',
  },
  {
    question: 'What is Presumptive Taxation under Section 44AD?',
    answer:
      'To relieve small shopkeepers and traders from burdensome bookkeeping requirements, Section 44AD of the Income Tax Act allows eligible businesses with turnover up to ₹2 Crore (or ₹3 Crore if 95% of receipts are digital) to declare a fixed presumptive profit of 6% (on digital receipts) or 8% (on cash receipts). Taxes are calculated on this deemed profit without needing detailed balance sheets.',
  },
  {
    question: 'What is the difference between Financial Year (FY) and Assessment Year (AY)?',
    answer:
      'The Financial Year (FY) is the 12-month period (April 1 to March 31) in which your income is earned. The Assessment Year (AY) is the consecutive year immediately following the FY in which that earned income is formally evaluated and taxed. For example, income earned in FY 2024-25 is assessed and filed in AY 2025-26.',
  },
];

export default function FAQ() {
  const { setIsSummaryModalOpen } = useBusiness();
  const [openIndices, setOpenIndices] = useState([0]); // First item open by default

  const toggleAccordion = (index) => {
    if (openIndices.includes(index)) {
      setOpenIndices(openIndices.filter((i) => i !== index));
    } else {
      setOpenIndices([...openIndices, index]);
    }
  };

  const expandAll = () => setOpenIndices(FAQS.map((_, i) => i));
  const collapseAll = () => setOpenIndices([]);

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Educational Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-emerald-600 font-bold">
          Frequently Asked Questions
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Common Questions on Small Business Taxes
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Clear answers designed to address common concerns and compliance queries for micro-business owners.
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
        <span>Showing {FAQS.length} common questions</span>
        <div className="flex items-center gap-3">
          <button
            onClick={expandAll}
            className="text-emerald-700 hover:underline font-semibold cursor-pointer"
          >
            Expand All
          </button>
          <span>•</span>
          <button
            onClick={collapseAll}
            className="text-slate-600 hover:underline cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndices.includes(idx);
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition overflow-hidden shadow-2xs ${
                faq.highlight
                  ? 'border-amber-300 bg-amber-50/40'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(idx)}
                className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      faq.highlight
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`text-sm sm:text-base font-semibold ${
                      faq.highlight ? 'text-amber-950 font-bold' : 'text-slate-900'
                    }`}
                  >
                    {faq.question}
                  </span>
                </div>
                <div className="text-slate-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isOpen && (
                <div
                  className={`px-6 pb-5 pt-1 text-xs sm:text-sm leading-relaxed border-t ${
                    faq.highlight
                      ? 'border-amber-200 text-amber-900 bg-amber-50/60'
                      : 'border-slate-100 text-slate-600'
                  }`}
                >
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold">Ready to Organize Your Business Records?</h3>
          <p className="text-xs text-slate-300">
            Start by logging your transactions or reviewing the digital preparation checklist.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/transactions"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
          >
            Open Tracker
          </Link>
          <button
            onClick={() => setIsSummaryModalOpen(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer"
          >
            Preparation Summary
          </button>
        </div>
      </div>
    </div>
  );
}
