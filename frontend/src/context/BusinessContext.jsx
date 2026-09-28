import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getBusinessProfile,
  getAllBusinesses,
  createBusinessProfile,
  updateBusinessProfile,
  resetDemoData,
} from '../services/api';

const BusinessContext = createContext();

const STORAGE_KEY = 'easytax_business_id';

export const BusinessProvider = ({ children }) => {
  const [business, setBusiness] = useState(null);
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch list of all existing business workspaces
  const fetchAllBusinesses = useCallback(async () => {
    try {
      const res = await getAllBusinesses();
      if (res.success && Array.isArray(res.data)) {
        setAllBusinesses(res.data);
      }
    } catch (err) {
      console.warn('Failed to load workspaces list:', err);
    }
  }, []);

  // Initialize or load existing workspace
  const initWorkspace = useCallback(async () => {
    try {
      setLoading(true);
      let currentId = localStorage.getItem(STORAGE_KEY);
      let activeBiz = null;

      // Returning visitor: check if existing workspace exists
      if (currentId) {
        try {
          const res = await getBusinessProfile();
          if (res.success && res.data) {
            activeBiz = res.data;
          }
        } catch (err) {
          // If stored ID was cleared from database or invalid, create clean workspace
          console.warn('Existing business workspace not found in DB. Creating new workspace...');
          localStorage.removeItem(STORAGE_KEY);
          currentId = null;
        }
      }

      // First visit: create a new business workspace automatically
      if (!currentId || !activeBiz) {
        const createRes = await createBusinessProfile({
          name: 'My Business',
          ownerName: 'Business Owner',
          businessType: 'Retail',
        });
        if (createRes.success && createRes.data) {
          activeBiz = createRes.data;
          localStorage.setItem(STORAGE_KEY, activeBiz._id);
        }
      }

      setBusiness(activeBiz);
      await fetchAllBusinesses();
    } catch (err) {
      console.error('Failed to initialize business workspace:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchAllBusinesses]);

  // Fetch current business details
  const fetchBusiness = useCallback(async () => {
    try {
      const currentId = localStorage.getItem(STORAGE_KEY);
      if (!currentId) return;
      const res = await getBusinessProfile();
      if (res.success && res.data) {
        setBusiness(res.data);
      }
    } catch (err) {
      console.error('Failed to load business profile:', err);
    }
  }, []);

  useEffect(() => {
    initWorkspace();
  }, [initWorkspace]);

  useEffect(() => {
    fetchAllBusinesses();
  }, [refreshTrigger, fetchAllBusinesses]);

  // Save profile updates
  const saveProfile = async (formData) => {
    const res = await updateBusinessProfile(formData);
    if (res.success && res.data) {
      setBusiness(res.data);
      setIsProfileModalOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    }
    return res;
  };

  // Switch to an existing business workspace
  const switchBusiness = async (businessId) => {
    try {
      setLoading(true);
      localStorage.setItem(STORAGE_KEY, businessId);
      const res = await getBusinessProfile();
      if (res.success && res.data) {
        setBusiness(res.data);
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Failed to switch business:', err);
    } finally {
      setLoading(false);
    }
  };

  // Start a new isolated business workspace
  const startNewBusiness = async (initialData = {}) => {
    try {
      setLoading(true);
      const res = await createBusinessProfile({
        name: initialData.name || 'New Business',
        ownerName: initialData.ownerName || 'Business Owner',
        businessType: initialData.businessType || 'Retail',
        city: initialData.city || '',
      });

      if (res.success && res.data) {
        localStorage.setItem(STORAGE_KEY, res.data._id);
        setBusiness(res.data);
        setRefreshTrigger((prev) => prev + 1);
        setIsProfileModalOpen(true);
        return res.data;
      }
    } catch (err) {
      console.error('Failed to create new business workspace:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset ONLY current business workspace to demo state
  const handleResetDemo = async () => {
    const res = await resetDemoData();
    if (res.success && res.data) {
      setBusiness(res.data);
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
        allBusinesses,
        loading,
        fetchBusiness,
        fetchAllBusinesses,
        switchBusiness,
        saveProfile,
        startNewBusiness,
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
