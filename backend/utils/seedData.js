const Business = require('../models/Business');
const Transaction = require('../models/Transaction');
const Checklist = require('../models/Checklist');
const DocumentStatus = require('../models/DocumentStatus');

const defaultChecklistItems = [
  // Financial Preparation
  { id: 'fin_income', label: 'Record all business income', section: 'Financial Preparation' },
  { id: 'fin_expense', label: 'Record business expenses', section: 'Financial Preparation' },
  { id: 'fin_sales', label: 'Review sales records', section: 'Financial Preparation' },
  { id: 'fin_purchases', label: 'Review purchase records', section: 'Financial Preparation' },
  { id: 'fin_bank', label: 'Check bank statements', section: 'Financial Preparation' },

  // Document Preparation
  { id: 'doc_pan', label: 'PAN details ready', section: 'Document Preparation' },
  { id: 'doc_id', label: 'Identity documents ready', section: 'Document Preparation' },
  { id: 'doc_bank', label: 'Bank statements ready', section: 'Document Preparation' },
  { id: 'doc_sales_inv', label: 'Sales invoices ready', section: 'Document Preparation' },
  { id: 'doc_purch_inv', label: 'Purchase invoices ready', section: 'Document Preparation' },
  { id: 'doc_exp_rec', label: 'Expense records ready', section: 'Document Preparation' },

  // Final Review
  { id: 'rev_biz_info', label: 'Verify business information', section: 'Final Review' },
  { id: 'rev_income_summary', label: 'Review income', section: 'Final Review' },
  { id: 'rev_expense_summary', label: 'Review expenses', section: 'Final Review' },
  { id: 'rev_taxable_calc', label: 'Review estimated taxable income', section: 'Final Review' },
  { id: 'rev_docs_complete', label: 'Check required documents', section: 'Final Review' },
  { id: 'rev_save_prep', label: 'Save preparation summary', section: 'Final Review' },
];

const defaultDocuments = [
  // Business Documents
  {
    name: 'Permanent Account Number (PAN) of Owner/Business',
    category: 'Business Documents',
    status: 'Missing',
    description: 'Mandatory 10-digit alphanumeric identifier for Indian tax compliance.',
  },
  {
    name: 'Business Registration / Udyam MSME Certificate',
    category: 'Business Documents',
    status: 'Missing',
    description: 'Government proof of enterprise existence and category.',
  },
  {
    name: 'Shop & Establishment / Municipal Trade License',
    category: 'Business Documents',
    status: 'Missing',
    description: 'Local municipal permit for commercial operations.',
  },

  // Financial Documents
  {
    name: 'Bank Account Statements (Past 12 Months)',
    category: 'Financial Documents',
    status: 'Missing',
    description: 'Official bank record for reconciliation of cash flows and receipts.',
  },
  {
    name: 'Sales Invoices & Cash Memo Counterfoils',
    category: 'Financial Documents',
    status: 'Missing',
    description: 'Bills issued to customers supporting total turnover.',
  },
  {
    name: 'Purchase Invoices from Distributors / Wholesalers',
    category: 'Financial Documents',
    status: 'Missing',
    description: 'Vendor bills showing Cost of Goods Sold (COGS).',
  },
  {
    name: 'Operating Expense Receipts (Rent, Utilities, Travel)',
    category: 'Financial Documents',
    status: 'Missing',
    description: 'Valid receipts and payment vouchers for deductible expenses.',
  },

  // Tax Documents
  {
    name: 'Previous Assessment Year ITR Acknowledgement (ITR-V)',
    category: 'Tax Documents',
    status: 'Missing',
    description: 'Copy of previously filed tax return for continuity and carry-forwards.',
  },
  {
    name: 'Annual Information Statement (AIS) & Form 26AS',
    category: 'Tax Documents',
    status: 'Missing',
    description: 'Income Tax department statement showing TDS credits and reported high-value transactions.',
  },
  {
    name: 'Advance Tax / Self-Assessment Challan Receipts',
    category: 'Tax Documents',
    status: 'Missing',
    description: 'Proof of tax paid during the financial year before deadline.',
  },
];

async function seedInitialData() {
  try {
    let business = await Business.findOne();
    if (!business) {
      business = await Business.create({
        name: 'My Business',
        ownerName: 'Business Owner',
        businessType: 'Retail',
        email: '',
        phone: '',
        city: '',
        businessStartDate: new Date('2024-04-01'),
      });
      console.log('✅ Clean default business profile created');
    }

    let checklist = await Checklist.findOne();
    if (!checklist) {
      await Checklist.create({
        businessId: business._id,
        completedItems: [],
      });
      console.log('✅ Clean checklist initialized');
    }

    let docStatus = await DocumentStatus.findOne();
    if (!docStatus) {
      await DocumentStatus.create({
        businessId: business._id,
        documents: defaultDocuments,
      });
      console.log('✅ Clean document status tracker initialized');
    }
  } catch (err) {
    console.error('Error during data seeding:', err.message);
  }
}

module.exports = {
  defaultChecklistItems,
  defaultDocuments,
  seedInitialData,
};
