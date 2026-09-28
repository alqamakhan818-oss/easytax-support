import React, { useState, useEffect } from 'react';
import { 
  FolderCheck, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  Printer, 
  RotateCcw,
  Sparkles,
  HelpCircle,
  X
} from 'lucide-react';
import { getDocuments, updateDocumentStatus, addCustomDocument } from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function Documents() {
  const { setIsSummaryModalOpen, triggerGlobalRefresh, refreshTrigger } = useBusiness();
  const [categories, setCategories] = useState({});
  const [summary, setSummary] = useState({ total: 10, ready: 0, missing: 10, percentage: 0 });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // New Custom Document Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDocData, setNewDocData] = useState({
    name: '',
    category: 'Business Documents',
    status: 'Available',
    description: '',
  });
  const [addingDoc, setAddingDoc] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [refreshTrigger]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const res = await getDocuments();
      if (res.success) {
        setCategories(res.data.categories || {});
        setSummary(res.data.summary || { total: 0, ready: 0, missing: 0, percentage: 0 });
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (documentId, currentStatus) => {
    const nextStatus = currentStatus === 'Available' ? 'Missing' : 'Available';

    try {
      setUpdatingId(documentId);
      const res = await updateDocumentStatus(documentId, nextStatus);
      if (res.success) {
        // Refresh documents list
        loadDocuments();
        triggerGlobalRefresh();
      }
    } catch (err) {
      console.error('Failed to update document status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddCustomDoc = async (e) => {
    e.preventDefault();
    if (!newDocData.name.trim()) return;

    try {
      setAddingDoc(true);
      const res = await addCustomDocument(newDocData);
      if (res.success) {
        setIsAddModalOpen(false);
        setNewDocData({
          name: '',
          category: 'Business Documents',
          status: 'Available',
          description: '',
        });
        loadDocuments();
        triggerGlobalRefresh();
      }
    } catch (err) {
      console.error('Failed to add custom document:', err);
    } finally {
      setAddingDoc(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Disclaimer */}
      <DisclaimerBanner compact />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Required Tax Documents</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Check off and keep your business papers and bank statements ready before tax filing
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 bg-white border border-slate-300 px-3.5 py-2 rounded-xl transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Add Custom Document</span>
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

      {/* Readiness Summary Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Readiness Status</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
              Documents Ready: <span className="text-emerald-600">{summary.ready}</span> / {summary.total}{' '}
              <span className="text-slate-400 text-lg font-medium">({summary.percentage}%)</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/50">
              {summary.ready} Available
            </span>
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/50">
              {summary.missing} Pending
            </span>
          </div>
        </div>

        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${summary.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Document Categories */}
      {loading ? (
        <div className="text-center py-12 text-slate-500">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Loading document status...
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(categories).map(([catName, docs]) => (
            <div key={catName} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="bg-slate-50/80 px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">{catName}</h3>
                <span className="text-xs text-slate-500 font-medium">
                  {docs.filter((d) => d.status === 'Available').length} of {docs.length} Ready
                </span>
              </div>

              <div className="p-4 sm:p-6 divide-y divide-slate-100">
                {docs.map((doc) => {
                  const isAvailable = doc.status === 'Available';
                  return (
                    <div
                      key={doc._id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                          <h4 className="text-sm font-semibold text-slate-800">{doc.name}</h4>
                        </div>
                        {doc.description && (
                          <p className="text-xs text-slate-500 pl-6 leading-relaxed">
                            {doc.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pl-6 sm:pl-0 shrink-0">
                        <button
                          onClick={() => handleToggleStatus(doc._id, doc.status)}
                          disabled={updatingId === doc._id}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50 ${
                            isAvailable
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {isAvailable ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Available</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                              <span>Missing</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Custom Document Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-base text-white">Add Custom Document Item</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomDoc} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newDocData.name}
                  onChange={(e) => setNewDocData({ ...newDocData, name: e.target.value })}
                  placeholder="e.g. Partnership Deed / Shop Insurance"
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Category
                </label>
                <select
                  value={newDocData.category}
                  onChange={(e) => setNewDocData({ ...newDocData, category: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                >
                  <option value="Business Documents">Business Documents</option>
                  <option value="Financial Documents">Financial Documents</option>
                  <option value="Tax Documents">Tax Documents</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Status</label>
                <select
                  value={newDocData.status}
                  onChange={(e) => setNewDocData({ ...newDocData, status: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                >
                  <option value="Available">Available</option>
                  <option value="Missing">Missing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Helpful Notes / Description (Optional)
                </label>
                <textarea
                  value={newDocData.description}
                  onChange={(e) => setNewDocData({ ...newDocData, description: e.target.value })}
                  placeholder="e.g. Physical copy kept in office cabinet file #2"
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingDoc}
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {addingDoc ? 'Adding...' : 'Add Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
