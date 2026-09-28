import React, { createContext, useContext, useState, useEffect } from 'react';
import { getBusinessProfile, updateBusinessProfile, resetDemoData } from '../services/api';

const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      const res = await getBusinessProfile();
      if (res.success && res.data) {
        setBusiness(res.data);
      }
    } catch (err) {
      console.error('Failed to load business profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
  }, [refreshTrigger]);

  const saveProfile = async (formData) => {
    const res = await updateBusinessProfile(formData);
    if (res.success && res.data) {
      setBusiness(res.data);
      setIsProfileModalOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    }
    return res;
  };

  const handleResetDemo = async () => {
    const res = await resetDemoData();
    if (res.success) {
      setRefreshTrigger((prev) => prev + 1);
    }
    return res;
  };

  const triggerGlobalRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <BusinessContext.Provider
      value={{
        business,
        loading,
        fetchBusiness,
        saveProfile,
        handleResetDemo,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isSummaryModalOpen,
        setIsSummaryModalOpen,
        triggerGlobalRefresh,
        refreshTrigger,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
