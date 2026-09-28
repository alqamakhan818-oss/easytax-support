const Business = require('../models/Business');
const Transaction = require('../models/Transaction');
const Checklist = require('../models/Checklist');
const DocumentStatus = require('../models/DocumentStatus');
const { seedInitialData } = require('../utils/seedData');

// GET /api/business - Get current business profile
const getBusiness = async (req, res, next) => {
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
    }
    return res.status(200).json({ success: true, data: business });
  } catch (error) {
    next(error);
  }
};

// PUT /api/business - Update business profile
const updateBusiness = async (req, res, next) => {
  try {
    const { name, ownerName, businessType, email, phone, city, businessStartDate } = req.body;

    if (!name || !ownerName) {
      return res.status(400).json({
        success: false,
        message: 'Business Name and Owner Name are required',
      });
    }

    let business = await Business.findOne();
    if (!business) {
      business = new Business({
        name,
        ownerName,
        businessType: businessType || 'Retail',
        email: email || '',
        phone: phone || '',
        city: city || '',
        businessStartDate: businessStartDate || Date.now(),
      });
    } else {
      business.name = name;
      business.ownerName = ownerName;
      if (businessType) business.businessType = businessType;
      if (email !== undefined) business.email = email;
      if (phone !== undefined) business.phone = phone;
      if (city !== undefined) business.city = city;
      if (businessStartDate) business.businessStartDate = businessStartDate;
    }

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

// POST /api/business/reset - Reset to educational demo data
const resetDemoData = async (req, res, next) => {
  try {
    await Business.deleteMany({});
    await Transaction.deleteMany({});
    await Checklist.deleteMany({});
    await DocumentStatus.deleteMany({});
    await seedInitialData();

    const business = await Business.findOne();
    return res.status(200).json({
      success: true,
      message: 'Demo dataset reset to initial state successfully',
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBusiness,
  updateBusiness,
  resetDemoData,
};
