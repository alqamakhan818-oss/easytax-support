const Business = require('../models/Business');
const Transaction = require('../models/Transaction');
const Checklist = require('../models/Checklist');
const DocumentStatus = require('../models/DocumentStatus');
const { defaultDocuments } = require('../utils/seedData');

// GET /api/business - Get current business profile by workspace ID
const getBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.businessId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business workspace not found',
      });
    }
    return res.status(200).json({ success: true, data: business });
  } catch (error) {
    next(error);
  }
};

// POST /api/business - Create a new business workspace
const createBusiness = async (req, res, next) => {
  try {
    const { name, ownerName, businessType, email, phone, city, businessStartDate } = req.body || {};

    const business = await Business.create({
      name: (name && name.trim()) || 'My Business',
      ownerName: (ownerName && ownerName.trim()) || 'Business Owner',
      businessType: businessType || 'Retail',
      email: email ? email.trim() : '',
      phone: phone ? phone.trim() : '',
      city: city ? city.trim() : '',
      businessStartDate: businessStartDate ? new Date(businessStartDate) : new Date('2024-04-01'),
    });

    // Initialize checklist for this business workspace
    await Checklist.create({
      businessId: business._id,
      completedItems: [],
    });

    // Initialize document tracker for this business workspace
    await DocumentStatus.create({
      businessId: business._id,
      documents: defaultDocuments,
    });

    return res.status(201).json({
      success: true,
      message: 'New business workspace created successfully',
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/business - Update business profile for the current workspace
const updateBusiness = async (req, res, next) => {
  try {
    const { name, ownerName, businessType, email, phone, city, businessStartDate } = req.body;

    if (!name || !ownerName) {
      return res.status(400).json({
        success: false,
        message: 'Business Name and Owner Name are required',
      });
    }

    const business = await Business.findById(req.businessId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business workspace not found',
      });
    }

    business.name = name.trim();
    business.ownerName = ownerName.trim();
    if (businessType) business.businessType = businessType;
    if (email !== undefined) business.email = email.trim();
    if (phone !== undefined) business.phone = phone.trim();
    if (city !== undefined) business.city = city.trim();
    if (businessStartDate) business.businessStartDate = new Date(businessStartDate);

    const updated = await business.save();
    return res.status(200).json({
      success: true,
      message: 'Business profile updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/business/reset - Reset ONLY the current business workspace to demo state
const resetDemoData = async (req, res, next) => {
  try {
    const business = await Business.findById(req.businessId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business workspace not found',
      });
    }

    // Safely delete ONLY this business's transactions, checklist, and documents
    await Transaction.deleteMany({ businessId: req.businessId });
    await Checklist.deleteMany({ businessId: req.businessId });
    await DocumentStatus.deleteMany({ businessId: req.businessId });

    // Recreate fresh checklist and document defaults for this SAME business
    await Checklist.create({
      businessId: business._id,
      completedItems: [],
    });

    await DocumentStatus.create({
      businessId: business._id,
      documents: defaultDocuments,
    });

    // Reset business profile to clean demo defaults while preserving its ID
    business.name = 'My Business';
    business.ownerName = 'Business Owner';
    business.businessType = 'Retail';
    business.email = '';
    business.phone = '';
    business.city = '';
    business.businessStartDate = new Date('2024-04-01');
    const updated = await business.save();

    return res.status(200).json({
      success: true,
      message: 'Workspace data reset to initial demo state successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBusiness,
  createBusiness,
  updateBusiness,
  resetDemoData,
};
