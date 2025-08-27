const express = require('express');
const { Analytics, User, Project, Task } = require('../models');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

// Get analytics data (filtered by user role)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, clientId } = req.query;
    
    let whereClause = {};
    
    // Add date filters
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    // Clients can only see their own analytics
    if (req.user.role === 'client') {
      whereClause.clientId = req.user.id;
    } else if (clientId) {
      // Admins can filter by specific client
      whereClause.clientId = clientId;
    }

    const analytics = await Analytics.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'client',
          attributes: { exclude: ['password'] }
        }
      ],
      order: [['date', 'DESC']]
    });

    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});

// Create/Update analytics data (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { clientId, date, metrics } = req.body;

    // Verify client exists
    const client = await User.findByPk(clientId);
    if (!client || client.role !== 'client') {
      return res.status(400).json({ message: 'Invalid client ID' });
    }

    // Check if analytics record already exists for this client and date
    let analytics = await Analytics.findOne({
      where: { clientId, date: new Date(date) }
    });

    if (analytics) {
      // Update existing record
      await analytics.update({ metrics });
    } else {
      // Create new record
      analytics = await Analytics.create({
        clientId,
        date: new Date(date),
        metrics,
      });
    }

    // Fetch complete analytics data
    const result = await Analytics.findByPk(analytics.id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    res.status(201).json({
      message: 'Analytics data saved successfully',
      analytics: result,
    });
  } catch (error) {
    console.error('Create analytics error:', error);
    res.status(500).json({ message: 'Error saving analytics data' });
  }
});

// Get dashboard summary data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    let whereClause = {};
    
    // Clients can only see their own data
    if (req.user.role === 'client') {
      whereClause.clientId = req.user.id;
    }

    // Get current date for filtering
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

    // Get recent analytics data
    const recentAnalytics = await Analytics.findAll({
      where: {
        ...whereClause,
        date: {
          [Op.gte]: thirtyDaysAgo
        }
      },
      order: [['date', 'DESC']],
      limit: 30
    });

    // Calculate aggregated metrics
    const aggregatedMetrics = recentAnalytics.reduce((acc, record) => {
      const metrics = record.metrics;
      
      acc.totalRevenue += metrics.revenue || 0;
      acc.totalProjects += metrics.projects || 0;
      acc.totalConversations += metrics.conversations || 0;
      acc.totalFacebookReach += metrics.facebookReach || 0;
      acc.totalInstagramEngagement += metrics.instagramEngagement || 0;
      acc.totalMessagesReceived += metrics.messagesReceived || 0;
      
      return acc;
    }, {
      totalRevenue: 0,
      totalProjects: 0,
      totalConversations: 0,
      totalFacebookReach: 0,
      totalInstagramEngagement: 0,
      totalMessagesReceived: 0
    });

    // Get project and task counts from database
    let projectCount = 0;
    let taskCounts = { total: 0, completed: 0, inProgress: 0 };

    if (req.user.role === 'admin') {
      projectCount = await Project.count({ where: { status: 'active' } });
      const tasks = await Task.findAll({ attributes: ['status'] });
      taskCounts.total = tasks.length;
      taskCounts.completed = tasks.filter(t => t.status === 'completed').length;
      taskCounts.inProgress = tasks.filter(t => t.status === 'in-progress').length;
    } else {
      projectCount = await Project.count({ 
        where: { clientId: req.user.id, status: 'active' } 
      });
      const tasks = await Task.findAll({ 
        include: [{ model: Project, as: 'project', where: { clientId: req.user.id } }],
        attributes: ['status']
      });
      taskCounts.total = tasks.length;
      taskCounts.completed = tasks.filter(t => t.status === 'completed').length;
      taskCounts.inProgress = tasks.filter(t => t.status === 'in-progress').length;
    }

    // Get team member count (admin only)
    let teamCount = 0;
    if (req.user.role === 'admin') {
      teamCount = await User.count({ where: { role: 'admin' } });
    }

    // Calculate growth rate (simple month-over-month comparison)
    const currentMonthData = recentAnalytics.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === today.getMonth() && 
             recordDate.getFullYear() === today.getFullYear();
    });

    const lastMonthData = recentAnalytics.filter(record => {
      const recordDate = new Date(record.date);
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
      return recordDate.getMonth() === lastMonth.getMonth() && 
             recordDate.getFullYear() === lastMonth.getFullYear();
    });

    const currentRevenue = currentMonthData.reduce((sum, r) => sum + (r.metrics.revenue || 0), 0);
    const lastRevenue = lastMonthData.reduce((sum, r) => sum + (r.metrics.revenue || 0), 0);
    const growthRate = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0;

    const dashboardData = {
      metrics: {
        revenue: Math.round(aggregatedMetrics.totalRevenue),
        projects: projectCount,
        teamMembers: teamCount,
        conversations: Math.round(aggregatedMetrics.totalConversations / recentAnalytics.length) || 0,
        facebookReach: Math.round(aggregatedMetrics.totalFacebookReach / recentAnalytics.length) || 0,
        instagramEngagement: Math.round(aggregatedMetrics.totalInstagramEngagement / recentAnalytics.length) || 0,
        messagesReceived: Math.round(aggregatedMetrics.totalMessagesReceived / recentAnalytics.length) || 0,
        growthRate: Math.round(growthRate * 100) / 100
      },
      tasks: taskCounts,
      chartData: recentAnalytics.reverse(), // Oldest first for charts
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Update client metrics (Admin only)
router.put('/client/:clientId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { clientId } = req.params;
    const { metrics } = req.body;

    // Verify client exists
    const client = await User.findByPk(clientId);
    if (!client || client.role !== 'client') {
      return res.status(400).json({ message: 'Invalid client ID' });
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Update or create today's analytics for this client
    let analytics = await Analytics.findOne({
      where: { clientId, date: today }
    });

    if (analytics) {
      await analytics.update({ metrics });
    } else {
      analytics = await Analytics.create({
        clientId,
        date: today,
        metrics,
      });
    }

    const result = await Analytics.findByPk(analytics.id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    res.json({
      message: 'Client metrics updated successfully',
      analytics: result,
    });
  } catch (error) {
    console.error('Update client metrics error:', error);
    res.status(500).json({ message: 'Error updating client metrics' });
  }
});

// Delete analytics data (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const analytics = await Analytics.findByPk(id);
    if (!analytics) {
      return res.status(404).json({ message: 'Analytics record not found' });
    }

    await analytics.destroy();

    res.json({ message: 'Analytics record deleted successfully' });
  } catch (error) {
    console.error('Delete analytics error:', error);
    res.status(500).json({ message: 'Error deleting analytics record' });
  }
});

module.exports = router;