import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function DisclaimerBanner({ compact = false }) {
  if (compact) {
    return (
      <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
        <span>
          <strong className="font-bold text-amber-950">Simple Reminder:</strong> This tool helps you organize records for tax preparation. To file your official tax return, please consult your Chartered Accountant (CA) or tax professional.
        </span>
      </div>
    );
  }

  return (
    <aside aria-label="Tax Preparation Disclaimer" className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 sm:p-5 text-amber-950 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-amber-100/90 rounded-xl text-amber-800 shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="text-sm">
          <p className="font-bold text-amber-950 text-sm sm:text-base mb-1">
            Important Notice for Small Business Owners
          </p>
          <p className="leading-relaxed text-amber-900 text-xs sm:text-sm">
            <strong className="font-bold text-amber-950">EasyTax Support</strong> is an easy-to-use preparation assistant for shopkeepers and small businesses. It helps you track your daily sales, bills, expenses, and documents so you are fully prepared before meeting your Chartered Accountant (CA) or Tax Consultant. This tool does not directly file your official tax return to the government tax portal.
          </p>
        </div>
      </div>
    </aside>
  );
}
