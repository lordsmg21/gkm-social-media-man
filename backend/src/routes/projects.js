const express = require('express');
const { Project, Task, User } = require('../models');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Get projects (filtered by user role)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let whereClause = {};
    
    // Clients can only see their own projects
    if (req.user.role === 'client') {
      whereClause.clientId = req.user.id;
    }

    const projects = await Project.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'client',
          attributes: { exclude: ['password'] }
        },
        {
          model: Task,
          as: 'tasks',
          include: [
            {
              model: User,
              as: 'creator',
              attributes: { exclude: ['password'] }
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Get project by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findByPk(id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: { exclude: ['password'] }
        },
        {
          model: Task,
          as: 'tasks',
          include: [
            {
              model: User,
              as: 'creator',
              attributes: { exclude: ['password'] }
            }
          ]
        }
      ]
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check access permissions
    if (req.user.role === 'client' && project.clientId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Error fetching project' });
  }
});

// Create new project (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, clientId, budget, startDate, endDate, assignedTo } = req.body;

    // Verify client exists
    const client = await User.findByPk(clientId);
    if (!client || client.role !== 'client') {
      return res.status(400).json({ message: 'Invalid client ID' });
    }

    const project = await Project.create({
      name,
      description,
      clientId,
      budget,
      startDate,
      endDate,
      assignedTo: assignedTo || [],
    });

    // Fetch the complete project data
    const createdProject = await Project.findByPk(project.id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    res.status(201).json({
      message: 'Project created successfully',
      project: createdProject,
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Error creating project' });
  }
});

// Update project
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, budget, startDate, endDate, assignedTo } = req.body;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.update({
      name,
      description,
      status,
      budget,
      startDate,
      endDate,
      assignedTo,
    });

    // Return updated project with relationships
    const updatedProject = await Project.findByPk(id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: { exclude: ['password'] }
        },
        {
          model: Task,
          as: 'tasks'
        }
      ]
    });

    res.json({
      message: 'Project updated successfully',
      project: updatedProject,
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Error updating project' });
  }
});

// Delete project (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete all associated tasks first
    await Task.destroy({ where: { projectId: id } });
    
    // Then delete the project
    await project.destroy();

    res.json({ message: 'Project and associated tasks deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
});

module.exports = router;