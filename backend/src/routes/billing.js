const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const { Invoice, User } = require('../models');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Ensure uploads directory exists
const ensureDirectoryExists = async (dir) => {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
};

// Configure multer for invoice uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/invoices');
    await ensureDirectoryExists(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `invoice-${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for invoices
  },
  fileFilter: (req, file, cb) => {
    // Only allow PDF files for invoices
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for invoices'), false);
    }
  },
});

// Get invoices (filtered by user role)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let whereClause = {};
    
    // Clients can only see their own invoices
    if (req.user.role === 'client') {
      whereClause.clientId = req.user.id;
    }

    const invoices = await Invoice.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'client',
          attributes: { exclude: ['password'] }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(invoices);
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ message: 'Error fetching invoices' });
  }
});

// Get invoice by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const invoice = await Invoice.findByPk(id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Check access permissions
    if (req.user.role === 'client' && invoice.clientId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(invoice);
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ message: 'Error fetching invoice' });
  }
});

// Create/Upload new invoice (Admin only)
router.post('/', authenticateToken, requireAdmin, upload.single('invoice'), async (req, res) => {
  try {
    const { clientId, amount, currency = 'USD', dueDate, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Invoice PDF file is required' });
    }

    // Verify client exists
    const client = await User.findByPk(clientId);
    if (!client || client.role !== 'client') {
      return res.status(400).json({ message: 'Invalid client ID' });
    }

    // Generate invoice number
    const invoiceCount = await Invoice.count();
    const invoiceNumber = `GKM-${String(invoiceCount + 1).padStart(6, '0')}`;

    const invoice = await Invoice.create({
      invoiceNumber,
      clientId,
      amount: parseFloat(amount),
      currency,
      dueDate: new Date(dueDate),
      description,
      filePath: req.file.path,
      status: 'sent',
    });

    // Fetch complete invoice data
    const createdInvoice = await Invoice.findByPk(invoice.id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    res.status(201).json({
      message: 'Invoice uploaded successfully',
      invoice: createdInvoice,
    });
  } catch (error) {
    console.error('Upload invoice error:', error);
    
    // Clean up uploaded file if database save failed
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up uploaded file:', unlinkError);
      }
    }
    
    res.status(500).json({ message: 'Error uploading invoice' });
  }
});

// Update invoice status (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paidDate, amount, dueDate, description } = req.body;

    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const updateData = {
      status,
      amount: amount ? parseFloat(amount) : invoice.amount,
      dueDate: dueDate ? new Date(dueDate) : invoice.dueDate,
      description: description !== undefined ? description : invoice.description,
    };

    // Set paid date when status changes to paid
    if (status === 'paid' && invoice.status !== 'paid') {
      updateData.paidDate = paidDate ? new Date(paidDate) : new Date();
    }

    await invoice.update(updateData);

    // Return updated invoice with relationships
    const updatedInvoice = await Invoice.findByPk(id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    res.json({
      message: 'Invoice updated successfully',
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ message: 'Error updating invoice' });
  }
});

// Download invoice
router.get('/:id/download', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Check access permissions
    if (req.user.role === 'client' && invoice.clientId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!invoice.filePath) {
      return res.status(404).json({ message: 'Invoice file not found' });
    }

    // Check if file exists
    try {
      await fs.access(invoice.filePath);
    } catch {
      return res.status(404).json({ message: 'Invoice file not found on disk' });
    }

    const filename = `${invoice.invoiceNumber}.pdf`;
    res.download(invoice.filePath, filename);
  } catch (error) {
    console.error('Download invoice error:', error);
    res.status(500).json({ message: 'Error downloading invoice' });
  }
});

// Delete invoice (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Delete file from disk if it exists
    if (invoice.filePath) {
      try {
        await fs.unlink(invoice.filePath);
      } catch (error) {
        console.error('Error deleting invoice file from disk:', error);
      }
    }

    // Delete invoice record from database
    await invoice.destroy();

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ message: 'Error deleting invoice' });
  }
});

// Get invoices by client (Admin only)
router.get('/client/:clientId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { clientId } = req.params;
    
    const invoices = await Invoice.findAll({
      where: { clientId },
      include: [
        {
          model: User,
          as: 'client',
          attributes: { exclude: ['password'] }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(invoices);
  } catch (error) {
    console.error('Get client invoices error:', error);
    res.status(500).json({ message: 'Error fetching client invoices' });
  }
});

module.exports = router;