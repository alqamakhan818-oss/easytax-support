const Checklist = require('../models/Checklist');
const Business = require('../models/Business');
const { defaultChecklistItems } = require('../utils/seedData');

// GET /api/checklist
const getChecklist = async (req, res, next) => {
  try {
    let checklist = await Checklist.findOne();
    if (!checklist) {
      const business = await Business.findOne();
      checklist = await Checklist.create({
        businessId: business ? business._id : null,
        completedItems: [],
      });
    }

    const completedSet = new Set(checklist.completedItems || []);

    const grouped = {
      'Financial Preparation': [],
      'Document Preparation': [],
      'Final Review': [],
    };

    defaultChecklistItems.forEach((item) => {
      const isCompleted = completedSet.has(item.id);
      if (grouped[item.section]) {
        grouped[item.section].push({
          ...item,
          completed: isCompleted,
        });
      }
    });

    const total = defaultChecklistItems.length;
    const completed = checklist.completedItems.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return res.status(200).json({
      success: true,
      data: {
        completedItems: checklist.completedItems,
        progress: {
          completed,
          total,
          percentage,
        },
        sections: grouped,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/checklist
const updateChecklist = async (req, res, next) => {
  try {
    const { completedItems } = req.body;

    if (!Array.isArray(completedItems)) {
      return res.status(400).json({
        success: false,
        message: 'completedItems must be an array of item IDs',
      });
    }

    // Filter to valid item IDs only
    const validIds = new Set(defaultChecklistItems.map((i) => i.id));
    const sanitizedList = [...new Set(completedItems.filter((id) => validIds.has(id)))];

    let checklist = await Checklist.findOne();
    if (!checklist) {
      const business = await Business.findOne();
      checklist = new Checklist({
        businessId: business ? business._id : null,
        completedItems: sanitizedList,
      });
    } else {
      checklist.completedItems = sanitizedList;
    }

    await checklist.save();

    const total = defaultChecklistItems.length;
    const completed = sanitizedList.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return res.status(200).json({
      success: true,
      message: 'Checklist updated successfully',
      data: {
        completedItems: checklist.completedItems,
        progress: {
          completed,
          total,
          percentage,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChecklist,
  updateChecklist,
};
