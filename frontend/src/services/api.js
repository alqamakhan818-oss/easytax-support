import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Centralized Request Interceptor: Automatically attaches X-Business-Id
api.interceptors.request.use(
  (config) => {
    try {
      const businessId = localStorage.getItem('easytax_business_id');
      if (businessId) {
        config.headers['X-Business-Id'] = businessId;
      }
    } catch (e) {
      console.warn('Unable to access localStorage for business ID:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Business Profile & Workspace APIs
export const getBusinessProfile = async () => {
  const res = await api.get('/business');
  return res.data;
};

export const getAllBusinesses = async () => {
  const res = await api.get('/business/all');
  return res.data;
};

export const createBusinessProfile = async (profileData = {}) => {
  const res = await api.post('/business', profileData);
  return res.data;
};

export const updateBusinessProfile = async (profileData) => {
  const res = await api.put('/business', profileData);
  return res.data;
};

export const resetDemoData = async () => {
  const res = await api.post('/business/reset');
  return res.data;
};

// Dashboard
export const getDashboardData = async () => {
  const res = await api.get('/dashboard');
  return res.data;
};

// Transactions
export const getTransactions = async (params = {}) => {
  const res = await api.get('/transactions', { params });
  return res.data;
};

export const createTransaction = async (txData) => {
  const res = await api.post('/transactions', txData);
  return res.data;
};

export const updateTransaction = async (id, txData) => {
  const res = await api.put(`/transactions/${id}`, txData);
  return res.data;
};

export const deleteTransaction = async (id) => {
  const res = await api.delete(`/transactions/${id}`);
  return res.data;
};

export const getTransactionCategories = async () => {
  const res = await api.get('/transactions/categories');
  return res.data;
};

// Checklist
export const getChecklist = async () => {
  const res = await api.get('/checklist');
  return res.data;
};

export const updateChecklist = async (completedItems) => {
  const res = await api.put('/checklist', { completedItems });
  return res.data;
};

// Documents
export const getDocuments = async () => {
  const res = await api.get('/documents');
  return res.data;
};

export const updateDocumentStatus = async (documentId, status, notes) => {
  const res = await api.put('/documents', { documentId, status, notes });
  return res.data;
};

export const addCustomDocument = async (docData) => {
  const res = await api.post('/documents', docData);
  return res.data;
};

export default api;
