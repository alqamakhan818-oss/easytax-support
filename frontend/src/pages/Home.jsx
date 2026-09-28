import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  FolderCheck, 
  ListChecks, 
  GraduationCap, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Store,
  ChevronRight
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { useBusiness } from '../context/BusinessContext';

export default function Home() {
  const { business, setIsProfileModalOpen } = useBusiness();

  const features = [
    {
      title: 'Record Sales & Income',
      description: 'Log daily counter sales, customer receipts, and digital payments with simple categories.',
      icon: TrendingUp,
      color: 'emerald',
      link: '/transactions?type=income',
    },
    {
      title: 'Track Shop Expenses',
      description: 'Keep track of wholesale stock purchases, shop rent, electricity bills, and staff wages.',
      icon: TrendingDown,
      color: 'rose',
      link: '/transactions?type=expense',
    },
    {
      title: 'Estimate Taxable Profit',
      description: 'Calculate total sales minus business costs to see your net profit and estimated tax bracket.',
      icon: Calculator,
      color: 'indigo',
      link: '/estimator',
    },
    {
      title: 'Organize Tax Documents',
      description: 'Keep essential records like PAN card, 12-month bank statements, and bills ready for your accountant.',
      icon: FolderCheck,
      color: 'blue',
      link: '/documents',
    },
    {
      title: 'Step-by-Step Checklist',
      description: 'Follow simple stages before, during, and after filing so you never miss an important step.',
      icon: ListChecks,
      color: 'amber',
      link: '/checklist',
    },
    {
      title: 'Beginner Tax Guide',
      description: 'Understand turnover, net profit, Section 44AD, and GST rules explained in simple words.',
      icon: GraduationCap,
      color: 'purple',
      link: '/learn',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Enter Business Details',
      desc: 'Set up your shop name, owner name, and business category in your profile.',
      action: () => setIsProfileModalOpen(true),
      actionText: 'Set Up Profile',
    },
    {
      step: '02',
      title: 'Log Daily Sales & Bills',
      desc: 'Record your daily income and business expenses to calculate your true net profit.',
      link: '/transactions',
      actionText: 'Open Records',
    },
    {
      step: '03',
      title: 'Verify Required Papers',
      desc: 'Use the document checklist to gather your bank passbook, invoices, and tax records.',
      link: '/documents',
      actionText: 'Check Papers',
    },
    {
      step: '04',
      title: 'Print Summary for CA',
      desc: 'Generate a clean summary report to hand directly to your Chartered Accountant or Tax Consultant.',
      link: '/summary',
      actionText: 'View Summary',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-radial from-emerald-50/70 via-slate-50 to-white pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Project Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Digital Tax Filing Support for Small Businesses</span>
            </div>

            {/* Main Hero Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Simplifying Tax Preparation for{' '}
              <span className="text-emerald-600 underline decoration-emerald-200 decoration-wavy">
                Small Businesses
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              An easy way for small shopkeepers and businesses to organize daily sales, bills, expenses, and documents before meeting their tax consultant.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition text-base cursor-pointer"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/learn"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-700 font-semibold px-6 py-3.5 rounded-xl border border-slate-300 shadow-2xs transition text-base cursor-pointer"
              >
                <span>Read Tax Guide</span>
              </Link>
            </div>

            {/* Current Active Profile Card preview */}
            <div className="pt-4 max-w-md mx-auto">
              <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs text-left">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Business Profile</p>
                    <p className="text-sm font-bold text-slate-800">
                      {business?.name || 'My Business'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline px-2 py-1 cursor-pointer"
                >
                  Edit Profile →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Disclaimer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DisclaimerBanner />
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Key Preparation Features
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Structured modules designed specifically to empower shopkeepers, traders, and small enterprise owners without accounting complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Link
                key={idx}
                to={feature.link}
                className="group bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition">
                  <span>Explore module</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Simple 4-Step Process</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">How It Works</h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2">
              From organizing your bills to generating an authorized preparation summary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((st, i) => (
              <div
                key={i}
                className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl relative flex flex-col justify-between hover:border-emerald-500/50 transition"
              >
                <div>
                  <div className="text-3xl font-extrabold text-emerald-400 font-mono mb-3">
                    {st.step}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{st.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {st.desc}
                  </p>
                </div>

                {st.link ? (
                  <Link
                    to={st.link}
                    className="inline-flex items-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 gap-1 mt-2"
                  >
                    <span>{st.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <button
                    onClick={st.action}
                    className="inline-flex items-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 gap-1 mt-2 text-left cursor-pointer"
                  >
                    <span>{st.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Small Business Support Mission Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Small Business Support Focus</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Bridging the Digital Tax Literacy Divide
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              India has over 63 million micro and small enterprises. Many face compliance penalties simply because receipts, invoices, and bank statements are unorganized when filing deadlines arrive. EasyTax Support equips small business proprietors with simple, confidence-building digital habits.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link
              to="/dashboard"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-6 py-3 rounded-xl transition shadow-xs text-center"
            >
              Open Dashboard
            </Link>
            <Link
              to="/faq"
              className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-sm px-6 py-3 rounded-xl transition text-center"
            >
              Read FAQs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
