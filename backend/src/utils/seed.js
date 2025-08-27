const bcrypt = require('bcryptjs');
const { User, Analytics } = require('../models');

async function seedDatabase() {
  try {
    console.log('Starting database seed...');

    // Create admin user
    const adminExists = await User.findOne({ where: { email: 'admin@gkm.com' } });
    if (!adminExists) {
      const hashedAdminPassword = await bcrypt.hash('admin123', 12);
      const admin = await User.create({
        name: 'GKM Admin',
        email: 'admin@gkm.com',
        password: hashedAdminPassword,
        role: 'admin',
        company: 'Gilton Karso Media',
        phone: '+1 (555) 123-4567',
      });
      console.log('Admin user created:', admin.email);
    }

    // Create demo client user
    const clientExists = await User.findOne({ where: { email: 'client@example.com' } });
    if (!clientExists) {
      const hashedClientPassword = await bcrypt.hash('client123', 12);
      const client = await User.create({
        name: 'Demo Client',
        email: 'client@example.com',
        password: hashedClientPassword,
        role: 'client',
        company: 'Demo Company Inc',
        phone: '+1 (555) 987-6543',
      });
      console.log('Demo client user created:', client.email);

      // Create some sample analytics data for the demo client
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000));
        await Analytics.create({
          clientId: client.id,
          date: date.toISOString().split('T')[0],
          metrics: {
            revenue: Math.floor(Math.random() * 10000) + 5000,
            projects: Math.floor(Math.random() * 10) + 3,
            conversations: Math.floor(Math.random() * 50) + 20,
            facebookReach: Math.floor(Math.random() * 50000) + 10000,
            instagramEngagement: Math.floor(Math.random() * 20) + 5,
            messagesReceived: Math.floor(Math.random() * 30) + 10,
            growthRate: Math.floor(Math.random() * 20) - 10
          }
        });
      }
      console.log('Sample analytics data created for demo client');
    }

    console.log('Database seed completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

module.exports = { seedDatabase };