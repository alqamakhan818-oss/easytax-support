import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldAlert, RotateCcw, Heart, CheckCircle2 } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';

export default function Footer() {
  const { handleResetDemo } = useBusiness();
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const onResetClick = async () => {
    if (window.confirm('Reset demo data to default sample transactions, checklist, and document state?')) {
      try {
        setResetting(true);
        await handleResetDemo();
        setResetSuccess(true);
        setTimeout(() => setResetSuccess(false), 3000);
      } catch (err) {
        console.error('Reset failed:', err);
      } finally {
        setResetting(false);
      }
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-200 mt-auto border-t border-slate-800 no-print">
      {/* Disclaimer Section */}
      <div className="bg-slate-950/80 border-b border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              <span className="font-semibold text-amber-300">Important Tax Disclaimer: </span>
              EasyTax Support is an educational and tax-preparation assistance tool for small businesses. It does not replace a Chartered Accountant (CA), tax professional, or official government tax-filing portal (such as incometax.gov.in). Tax calculations shown are estimates for educational purposes only. It does not submit official returns.
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">EasyTax Support</span>
            </div>
            <p className="text-sm text-slate-300 max-w-md leading-relaxed">
              Built with the MERN Stack and Tailwind CSS v4 to empower micro, small, and medium enterprises (MSMEs) with foundational tax literacy and digital preparation workflows.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onResetClick}
                disabled={resetting}
                className="inline-flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
                <span>{resetting ? 'Resetting...' : 'Reset Demo Dataset'}</span>
              </button>
              {resetSuccess && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sample data restored!
                </span>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Preparation Tools</h2>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link to="/dashboard" className="hover:text-emerald-400 transition">Dashboard Overview</Link></li>
              <li><Link to="/transactions" className="hover:text-emerald-400 transition">Income & Expenses</Link></li>
              <li><Link to="/estimator" className="hover:text-emerald-400 transition">Tax Estimator</Link></li>
              <li><Link to="/checklist" className="hover:text-emerald-400 transition">Filing Checklist</Link></li>
              <li><Link to="/documents" className="hover:text-emerald-400 transition">Documents Tracker</Link></li>
              <li><Link to="/summary" className="hover:text-emerald-400 transition">Preparation Summary</Link></li>
            </ul>
          </div>

          {/* Educational Resources */}
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Tax Learning</h2>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link to="/learn" className="hover:text-emerald-400 transition">Tax Fundamentals Guide</Link></li>
              <li><Link to="/learn#glossary" className="hover:text-emerald-400 transition">Tax Terminology Glossary</Link></li>
              <li><Link to="/faq" className="hover:text-emerald-400 transition">Frequently Asked Questions</Link></li>
              <li><span className="text-slate-400 text-xs">No Login / No Auth Required</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-4">
          <p>© {new Date().getFullYear()} EasyTax Support — Digital Tax Filing Support for Small Businesses.</p>
          <p className="flex items-center gap-1.5">
            Designed for Small Businesses with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> & MERN Stack
          </p>
        </div>
      </div>
    </footer>
  );
}
