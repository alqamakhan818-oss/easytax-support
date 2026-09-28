import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  Printer, 
  ShieldCheck, 
  HelpCircle 
} from 'lucide-react';
import { getChecklist, updateChecklist } from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function FilingChecklist() {
  const { setIsSummaryModalOpen, triggerGlobalRefresh, refreshTrigger } = useBusiness();
  const [sections, setSections] = useState({});
  const [completedItems, setCompletedItems] = useState([]);
  const [progress, setProgress] = useState({ completed: 0, total: 17, percentage: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadChecklist();
  }, [refreshTrigger]);

  const loadChecklist = async () => {
    try {
      setLoading(true);
      const res = await getChecklist();
      if (res.success) {
        setSections(res.data.sections || {});
        setCompletedItems(res.data.completedItems || []);
        setProgress(res.data.progress || { completed: 0, total: 17, percentage: 0 });
      }
    } catch (err) {
      console.error('Failed to load checklist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItem = async (itemId) => {
    const isCurrentlyChecked = completedItems.includes(itemId);
    const updated = isCurrentlyChecked
      ? completedItems.filter((id) => id !== itemId)
      : [...completedItems, itemId];

    // Optimistic UI update
    setCompletedItems(updated);
    const total = progress.total || 17;
    const count = updated.length;
    setProgress({
      completed: count,
      total,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    });

    try {
      setSaving(true);
      await updateChecklist(updated);
      triggerGlobalRefresh();
    } catch (err) {
      console.error('Failed to update checklist item:', err);
      // Revert if error
      loadChecklist();
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSection = async (sectionName) => {
    const items = sections[sectionName] || [];
    const itemIds = items.map((i) => i.id);
    const allChecked = itemIds.every((id) => completedItems.includes(id));

    let updated;
    if (allChecked) {
      // Uncheck all in this section
      updated = completedItems.filter((id) => !itemIds.includes(id));
    } else {
      // Check all in this section
      updated = [...new Set([...completedItems, ...itemIds])];
    }

    setCompletedItems(updated);
    const total = progress.total || 17;
    setProgress({
      completed: updated.length,
      total,
      percentage: Math.round((updated.length / total) * 100),
    });

    try {
      setSaving(true);
      await updateChecklist(updated);
      triggerGlobalRefresh();
    } catch (err) {
      console.error('Failed to toggle section:', err);
      loadChecklist();
    } finally {
      setSaving(false);
    }
  };

  const handleResetChecklist = async () => {
    if (window.confirm('Reset all checklist items to unchecked state?')) {
      try {
        setSaving(true);
        await updateChecklist([]);
        setCompletedItems([]);
        setProgress({ completed: 0, total: progress.total, percentage: 0 });
        triggerGlobalRefresh();
      } catch (err) {
        console.error('Failed to reset checklist:', err);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Educational Disclaimer Banner */}
      <DisclaimerBanner compact />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tax Preparation Checklist</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Follow these simple steps to make sure your business records and bills are ready for your accountant
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetChecklist}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-300 px-3.5 py-2 rounded-xl transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Checklist</span>
          </button>
          <button
            onClick={() => setIsSummaryModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Summary</span>
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Preparation Progress</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {progress.completed} / {progress.total} Completed{' '}
              <span className="text-emerald-600 text-lg font-bold">({progress.percentage}%)</span>
            </div>
          </div>
          {progress.percentage === 100 ? (
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>All Steps Completed!</span>
            </div>
          ) : (
            <div className="text-xs text-slate-500">
              {saving ? 'Saving changes to database...' : 'Synced with MongoDB'}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Sections List */}
      {loading ? (
        <div className="text-center py-12 text-slate-500">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Loading checklist...
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(sections).map(([sectionName, items]) => {
            const sectionTotal = items.length;
            const sectionCompleted = items.filter((i) => completedItems.includes(i.id)).length;
            const isAllCompleted = sectionTotal > 0 && sectionCompleted === sectionTotal;

            return (
              <div key={sectionName} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                {/* Section Header */}
                <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{sectionName}</h3>
                    <p className="text-xs text-slate-500">
                      {sectionCompleted} of {sectionTotal} tasks completed
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleSection(sectionName)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition cursor-pointer"
                  >
                    {isAllCompleted ? 'Uncheck Section' : 'Mark Section Done'}
                  </button>
                </div>

                {/* Section Items */}
                <div className="p-4 sm:p-6 divide-y divide-slate-100">
                  {items.map((item) => {
                    const isChecked = completedItems.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggleItem(item.id)}
                        className="py-3 px-2 flex items-center justify-between rounded-xl hover:bg-slate-50/80 transition cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            className="shrink-0 text-emerald-600 focus:outline-hidden"
                            aria-label={`Toggle ${item.label}`}
                          >
                            {isChecked ? (
                              <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
                            )}
                          </button>
                          <span
                            className={`text-sm font-medium transition ${
                              isChecked
                                ? 'line-through text-slate-400 font-normal'
                                : 'text-slate-800'
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>

                        {isChecked && (
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            Ready
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
