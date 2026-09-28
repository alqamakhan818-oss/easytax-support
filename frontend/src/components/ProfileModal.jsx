import React, { useState, useEffect } from 'react';
import { X, Building2, User, Phone, Mail, MapPin, Calendar, Briefcase, Check, Plus } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { toInputDateFormat } from '../utils/formatters';

const BUSINESS_TYPES = [
  'Retail',
  'Restaurant',
  'Service',
  'Freelancer',
  'Small Manufacturer',
  'Other',
];

export default function ProfileModal() {
  const { business, isProfileModalOpen, setIsProfileModalOpen, saveProfile, startNewBusiness } = useBusiness();
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    businessType: 'Retail',
    email: '',
    phone: '',
    city: '',
    businessStartDate: toInputDateFormat(),
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || '',
        ownerName: business.ownerName || '',
        businessType: business.businessType || 'Retail',
        email: business.email || '',
        phone: business.phone || '',
        city: business.city || '',
        businessStartDate: toInputDateFormat(business.businessStartDate),
      });
    }
  }, [business, isProfileModalOpen]);

  if (!isProfileModalOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.ownerName.trim()) {
      setErrorMsg('Business Name and Owner Name are required.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      await saveProfile(formData);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update business profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartNew = async () => {
    if (window.confirm('Create a new business workspace? Your current business records will be safely preserved.')) {
      try {
        setSubmitting(true);
        setErrorMsg('');
        await startNewBusiness({
          name: 'New Business',
          ownerName: 'Business Owner',
          businessType: 'Retail',
        });
      } catch (err) {
        setErrorMsg('Failed to start new business.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-600 rounded-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">Business Profile</h3>
              <p className="text-xs text-slate-300">Manage your business & tax entity details</p>
            </div>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {errorMsg && (
              <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg font-medium">
                {errorMsg}
              </div>
            )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Business Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter business name (e.g. City Traders)"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                />
              </div>
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Owner Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Enter proprietor / owner name"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                />
              </div>
            </div>

            {/* Business Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Type <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-white appearance-none"
                >
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@business.com"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City / Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai, Delhi, Jaipur"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                />
              </div>
            </div>

            {/* Business Start Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Business Start Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="date"
                  name="businessStartDate"
                  value={formData.businessStartDate}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-white"
                />
              </div>
            </div>
          </div>

            <p className="text-xs text-slate-400 pt-1">
              * No authentication required. This profile is stored locally in your MongoDB database for easy demonstration.
            </p>
          </div>

          {/* Sticky Actions Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={handleStartNew}
              disabled={submitting}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition cursor-pointer disabled:opacity-50"
              title="Create a fresh business workspace"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Start New Business</span>
            </button>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{submitting ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
