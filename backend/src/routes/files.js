const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const { File, User, Project } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Ensure uploads directory exists
const ensureDirectoryExists = async (dir) => {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    await ensureDirectoryExists(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 209715200, // 200MB default
  },
  fileFilter: (req, file, cb) => {
    // Allow most common file types
    const allowedTypes = /\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|mp4|mov|avi|zip|rar)$/i;
    if (allowedTypes.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'), false);
    }
  },
});

// Get files (filtered by access permissions)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let whereClause = {};
    
    // Clients can only see files they uploaded or files accessible to them
    if (req.user.role === 'client') {
      whereClause = {
        $or: [
          { uploadedBy: req.user.id },
          { accessibleTo: { $contains: [req.user.id] } },
          { isPublic: true }
        ]
      };
    }

    const files = await File.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: { exclude: ['password'] }
        },
        {
          model: Project,
          as: 'project',
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(files);
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ message: 'Error fetching files' });
  }
});

// Upload file
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { projectId, taskId, accessibleTo, isPublic } = req.body;

    // Parse accessibleTo if it's a string
    let parsedAccessibleTo = [];
    if (accessibleTo) {
      try {
        parsedAccessibleTo = typeof accessibleTo === 'string' ? JSON.parse(accessibleTo) : accessibleTo;
      } catch {
        parsedAccessibleTo = [];
      }
    }

    const fileData = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadedBy: req.user.id,
      projectId: projectId || null,
      taskId: taskId || null,
      accessibleTo: parsedAccessibleTo,
      isPublic: isPublic === 'true' || isPublic === true,
    };

    const file = await File.create(fileData);

    // Fetch complete file data with relationships
    const createdFile = await File.findByPk(file.id, {
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: { exclude: ['password'] }
        },
        {
          model: Project,
          as: 'project',
          required: false
        }
      ]
    });

    res.status(201).json({
      message: 'File uploaded successfully',
      file: createdFile,
    });
  } catch (error) {
    console.error('File upload error:', error);
    
    // Clean up uploaded file if database save failed
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up uploaded file:', unlinkError);
      }
    }
    
    res.status(500).json({ message: 'Error uploading file' });
  }
});

// Download/serve file
router.get('/:id/download', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const file = await File.findByPk(id, {
      include: [
        {
          model: Project,
          as: 'project'
        }
      ]
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check access permissions
    const hasAccess = 
      file.isPublic ||
      file.uploadedBy === req.user.id ||
      file.accessibleTo.includes(req.user.id) ||
      req.user.role === 'admin' ||
      (file.project && file.project.clientId === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if file exists
    try {
      await fs.access(file.path);
    } catch {
      return res.status(404).json({ message: 'File not found on disk' });
    }

    res.download(file.path, file.originalName);
  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({ message: 'Error downloading file' });
  }
});

// Delete file
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const file = await File.findByPk(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check permissions - only admins or the uploader can delete
    if (req.user.role !== 'admin' && file.uploadedBy !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete file from disk
    try {
      await fs.unlink(file.path);
    } catch (error) {
      console.error('Error deleting file from disk:', error);
    }

    // Delete file record from database
    await file.destroy();

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

// Get files by project
router.get('/project/:projectId', authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Verify project access
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role === 'client' && project.clientId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const files = await File.findAll({
      where: { projectId },
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: { exclude: ['password'] }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(files);
  } catch (error) {
    console.error('Get project files error:', error);
    res.status(500).json({ message: 'Error fetching project files' });
  }
});

module.exports = router;