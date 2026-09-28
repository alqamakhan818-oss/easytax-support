import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home'; // Eagerly loaded for instant FCP and zero layout shift (CLS = 0)
import { BusinessProvider } from './context/BusinessContext';

// Route-level code-splitting for heavy feature pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const IncomeExpenses = lazy(() => import('./pages/IncomeExpenses'));
const TaxEstimator = lazy(() => import('./pages/TaxEstimator'));
const FilingChecklist = lazy(() => import('./pages/FilingChecklist'));
const Documents = lazy(() => import('./pages/Documents'));
const Learn = lazy(() => import('./pages/Learn'));
const FAQ = lazy(() => import('./pages/FAQ'));
const SummaryPage = lazy(() => import('./pages/SummaryPage'));

// Lazy load global modals so their code is only fetched when opened
const ProfileModal = lazy(() => import('./components/ProfileModal'));
const SummaryModal = lazy(() => import('./components/SummaryModal'));

// Clean loading placeholder that prevents layout shift
const PageLoadingFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-3 border-emerald-200 border-t-emerald-700 animate-spin" />
  </div>
);

export default function App() {
  return (
    <BusinessProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans selection:bg-emerald-100 selection:text-emerald-900">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <Dashboard />
                </Suspense>
              }
            />
            <Route
              path="/transactions"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <IncomeExpenses />
                </Suspense>
              }
            />
            <Route
              path="/estimator"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <TaxEstimator />
                </Suspense>
              }
            />
            <Route
              path="/checklist"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <FilingChecklist />
                </Suspense>
              }
            />
            <Route
              path="/documents"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <Documents />
                </Suspense>
              }
            />
            <Route
              path="/learn"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <Learn />
                </Suspense>
              }
            />
            <Route
              path="/faq"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <FAQ />
                </Suspense>
              }
            />
            <Route
              path="/summary"
              element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <SummaryPage />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />

        {/* Global Modals (Lazy Loaded) */}
        <Suspense fallback={null}>
          <ProfileModal />
          <SummaryModal />
        </Suspense>
      </div>
    </BusinessProvider>
  );
}
