const DocumentStatus = require('../models/DocumentStatus');
const { defaultDocuments } = require('../utils/seedData');

// GET /api/documents - Get documents for current business workspace
const getDocuments = async (req, res, next) => {
  try {
    let docDoc = await DocumentStatus.findOne({ businessId: req.businessId });
    if (!docDoc) {
      docDoc = await DocumentStatus.create({
        businessId: req.businessId,
        documents: defaultDocuments,
      });
    }

    const docs = docDoc.documents || [];
    const total = docs.length;
    const ready = docs.filter((d) => d.status === 'Available').length;
    const missing = total - ready;
    const percentage = total > 0 ? Math.round((ready / total) * 100) : 0;

    // Group by category
    const grouped = {
      'Business Documents': [],
      'Financial Documents': [],
      'Tax Documents': [],
    };

    docs.forEach((doc) => {
      if (grouped[doc.category]) {
        grouped[doc.category].push(doc);
      } else {
        grouped['Business Documents'].push(doc);
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          total,
          ready,
          missing,
          percentage,
        },
        documents: docs,
        categories: grouped,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/documents - Update document status for current business workspace
const updateDocumentStatus = async (req, res, next) => {
  try {
    const { documentId, status, notes } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: 'documentId is required',
      });
    }

    if (status && !['Available', 'Missing'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'Available' or 'Missing'",
      });
    }

    let docDoc = await DocumentStatus.findOne({ businessId: req.businessId });
    if (!docDoc) {
      docDoc = await DocumentStatus.create({
        businessId: req.businessId,
        documents: defaultDocuments,
      });
    }

    const docItem =
      docDoc.documents.id(documentId) ||
      docDoc.documents.find(
        (d) => d._id.toString() === documentId || d.name === documentId
      );

    if (!docItem) {
      return res.status(404).json({
        success: false,
        message: 'Document record not found',
      });
    }

    if (status) docItem.status = status;
    if (notes !== undefined) docItem.description = notes;

    await docDoc.save();

    const total = docDoc.documents.length;
    const ready = docDoc.documents.filter((d) => d.status === 'Available').length;
    const missing = total - ready;
    const percentage = total > 0 ? Math.round((ready / total) * 100) : 0;

    return res.status(200).json({
      success: true,
      message: `Document status updated to ${docItem.status}`,
      data: {
        document: docItem,
        summary: {
          total,
          ready,
          missing,
          percentage,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/documents - Add custom document for current business workspace
const addCustomDocument = async (req, res, next) => {
  try {
    const { name, category, status, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Document name is required',
      });
    }

    let docDoc = await DocumentStatus.findOne({ businessId: req.businessId });
    if (!docDoc) {
      docDoc = await DocumentStatus.create({
        businessId: req.businessId,
        documents: defaultDocuments,
      });
    }

    docDoc.documents.push({
      name: name.trim(),
      category: ['Business Documents', 'Financial Documents', 'Tax Documents'].includes(category)
        ? category
        : 'Business Documents',
      status: status === 'Available' ? 'Available' : 'Missing',
      description: description || '',
    });

    await docDoc.save();

    return res.status(201).json({
      success: true,
      message: 'Custom document item added successfully',
      data: docDoc.documents[docDoc.documents.length - 1],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDocuments,
  updateDocumentStatus,
  addCustomDocument,
};
