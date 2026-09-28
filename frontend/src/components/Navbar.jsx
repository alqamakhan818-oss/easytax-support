import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  LayoutDashboard, 
  ArrowLeftRight, 
  Calculator, 
  CheckSquare, 
  FileText, 
  BookOpen, 
  HelpCircle, 
  Menu, 
  X, 
  FileCheck,
  Store,
  ChevronDown,
  Check,
  Plus
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const {
    business,
    allBusinesses,
    switchBusiness,
    setIsProfileModalOpen,
    setIsSummaryModalOpen,
  } = useBusiness();
  const location = useLocation();
  const moreRef = useRef(null);

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary operational tools (always visible on desktop lg & xl)
  const primaryLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Sales & Expenses', path: '/transactions', icon: ArrowLeftRight },
    { name: 'Tax Estimator', path: '/estimator', icon: Calculator },
    { name: 'Checklist', path: '/checklist', icon: CheckSquare },
    { name: 'Documents', path: '/documents', icon: FileText },
  ];

  // Secondary tools (in 'More ▾' on lg 1024-1279px, directly visible on xl 1280px+)
  const secondaryLinks = [
    { name: 'Home', path: '/', icon: Store },
    { name: 'Tax Guide', path: '/learn', icon: BookOpen },
    { name: 'Help & FAQ', path: '/faq', icon: HelpCircle },
  ];

  // All 8 links in natural workflow order for wide screens (xl) and mobile drawer
  const allNavLinks = [
    { name: 'Home', path: '/', icon: Store },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Sales & Expenses', path: '/transactions', icon: ArrowLeftRight },
    { name: 'Tax Estimator', path: '/estimator', icon: Calculator },
    { name: 'Checklist', path: '/checklist', icon: CheckSquare },
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'Tax Guide', path: '/learn', icon: BookOpen },
    { name: 'Help & FAQ', path: '/faq', icon: HelpCircle },
  ];

  const isSecondaryActive = secondaryLinks.some((l) => location.pathname === l.path);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs no-print w-full">
      <div className="w-full max-w-[1536px] mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-2 xl:gap-2.5 shrink-0 group">
            <div className="w-8 h-8 xl:w-9 xl:h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-800 transition shrink-0">
              <Building2 className="w-4 h-4 xl:w-5 xl:h-5" />
            </div>
            <span className="font-extrabold text-sm xl:text-base text-slate-900 tracking-tight whitespace-nowrap">
              EasyTax Support
            </span>
          </Link>

          {/* Desktop Nav Links — Wide Screens (>= 1280px / xl): All 8 links directly visible */}
          <nav className="hidden xl:flex items-center gap-1">
            {allNavLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold transition whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop Nav Links — Medium Screens (1024px - 1279px / lg): 5 Core Tools + 'More ▾' */}
          <nav className="hidden lg:flex xl:hidden items-center gap-1">
            {primaryLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}

            {/* 'More ▾' Dropdown on Medium Screens */}
            <div className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  isSecondaryActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {secondaryLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMoreOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 px-3 py-2 text-xs font-semibold transition ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-700'
                          }`
                        }
                      >
                        <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{link.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Buttons — Always pinned, prioritized, never cut off */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {/* Business Profile pill & Switcher */}
            {allBusinesses && allBusinesses.length > 1 ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition cursor-pointer whitespace-nowrap shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <select
                  value={business?._id || ''}
                  onChange={(e) => switchBusiness(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 outline-hidden cursor-pointer max-w-[110px] xl:max-w-[140px] truncate"
                  title="Switch active business workspace"
                >
                  {allBusinesses.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(true)}
                  className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold ml-1 pl-1.5 border-l border-slate-300 cursor-pointer"
                  title="Edit profile details"
                >
                  Edit
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition cursor-pointer whitespace-nowrap shrink-0"
                title="Click to view/edit business profile"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="truncate max-w-[95px] xl:max-w-[125px] font-semibold text-slate-800">
                  {business?.name || 'My Business'}
                </span>
              </button>
            )}

            {/* Preparation Summary button */}
            <button
              onClick={() => setIsSummaryModalOpen(true)}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition shadow-2xs hover:shadow-xs cursor-pointer whitespace-nowrap shrink-0"
              title="Open Tax Preparation Summary"
            >
              <FileCheck className="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0" />
              <span>Summary</span>
            </button>
          </div>

          {/* Mobile / Tablet controls (Screen < 1024px) */}
          <div className="flex items-center lg:hidden gap-2 shrink-0">
            <button
              onClick={() => setIsSummaryModalOpen(true)}
              className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-2xs cursor-pointer whitespace-nowrap shrink-0"
              title="Open Tax Preparation Summary"
            >
              <FileCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Summary</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Clean, scrollable, full names) */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="pb-3 mb-2 border-b border-slate-100">
            <button
              onClick={() => {
                setIsOpen(false);
                setIsProfileModalOpen(true);
              }}
              className="flex items-center justify-between gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2.5 rounded-xl w-full text-left transition cursor-pointer border border-emerald-200/60"
            >
              <div className="flex items-center gap-2 truncate">
                <Store className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{business?.name || 'My Business'}</span>
              </div>
              <span className="text-[10px] bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded-md font-bold shrink-0">
                Edit Profile →
              </span>
            </button>
          </div>

          {allNavLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
}
