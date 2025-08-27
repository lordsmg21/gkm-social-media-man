const express = require('express');
const { Task, Project, User } = require('../models');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Get tasks (filtered by user role and project access)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let whereClause = {};
    
    // If client, only show tasks from their projects
    if (req.user.role === 'client') {
      const userProjects = await Project.findAll({
        where: { clientId: req.user.id },
        attributes: ['id']
      });
      const projectIds = userProjects.map(p => p.id);
      whereClause.projectId = projectIds;
    }

    const tasks = await Task.findAll({
      where: whereClause,
      include: [
        {
          model: Project,
          as: 'project',
          include: [
            {
              model: User,
              as: 'client',
              attributes: { exclude: ['password'] }
            }
          ]
        },
        {
          model: User,
          as: 'creator',
          attributes: { exclude: ['password'] }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Get task by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findByPk(id, {
      include: [
        {
          model: Project,
          as: 'project',
          include: [
            {
              model: User,
              as: 'client',
              attributes: { exclude: ['password'] }
            }
          ]
        },
        {
          model: User,
          as: 'creator',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check access permissions
    if (req.user.role === 'client' && task.project.clientId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Error fetching task' });
  }
});

// Create new task (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      projectId, 
      priority, 
      assignedTo, 
      dueDate, 
      customTag,
      attachments 
    } = req.body;

    // Verify project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      priority: priority || 'medium',
      assignedTo: assignedTo || [],
      dueDate,
      customTag,
      attachments: attachments || [],
      createdBy: req.user.id,
    });

    // Fetch the complete task data
    const createdTask = await Task.findByPk(task.id, {
      include: [
        {
          model: Project,
          as: 'project',
          include: [
            {
              model: User,
              as: 'client',
              attributes: { exclude: ['password'] }
            }
          ]
        },
        {
          model: User,
          as: 'creator',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    res.status(201).json({
      message: 'Task created successfully',
      task: createdTask,
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Update task
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      status, 
      priority, 
      assignedTo, 
      dueDate, 
      customTag,
      attachments 
    } = req.body;

    const task = await Task.findByPk(id, {
      include: [
        {
          model: Project,
          as: 'project'
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check permissions - clients can only update tasks in their projects
    if (req.user.role === 'client' && task.project.clientId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await task.update({
      title,
      description,
      status,
      priority,
      assignedTo,
      dueDate,
      customTag,
      attachments,
    });

    // Return updated task with relationships
    const updatedTask = await Task.findByPk(id, {
      include: [
        {
          model: Project,
          as: 'project',
          include: [
            {
              model: User,
              as: 'client',
              attributes: { exclude: ['password'] }
            }
          ]
        },
        {
          model: User,
          as: 'creator',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    res.json({
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Delete task (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.destroy();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// Get tasks by project
router.get('/project/:projectId', authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Verify project exists and user has access
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role === 'client' && project.clientId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await Task.findAll({
      where: { projectId },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: { exclude: ['password'] }
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks by project error:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

module.exports = router;