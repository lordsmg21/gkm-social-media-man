const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'client'),
    allowNull: false,
    defaultValue: 'client',
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isOnline: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lastSeen: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  preferences: {
    type: DataTypes.JSONB,
    defaultValue: {
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      theme: 'light',
      language: 'en'
    },
  },
}, {
  timestamps: true,
  tableName: 'users',
});

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'on-hold', 'cancelled'),
    defaultValue: 'active',
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  assignedTo: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  timestamps: true,
  tableName: 'projects',
});

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('to-do', 'in-progress', 'final-design', 'review', 'completed', 'scheduled', 'ads'),
    defaultValue: 'to-do',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  },
  assignedTo: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'projects',
      key: 'id',
    },
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  customTag: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  attachments: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  timestamps: true,
  tableName: 'tasks',
});

const File = sequelize.define('File', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mimetype: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  uploadedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'projects',
      key: 'id',
    },
  },
  taskId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'tasks',
      key: 'id',
    },
  },
  accessibleTo: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  timestamps: true,
  tableName: 'files',
});

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('text', 'file', 'image', 'system'),
    defaultValue: 'text',
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  conversationId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  replyTo: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'messages',
      key: 'id',
    },
  },
  attachments: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  readBy: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  timestamps: true,
  tableName: 'messages',
});

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('direct', 'group'),
    defaultValue: 'direct',
  },
  participants: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  lastMessageAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  timestamps: true,
  tableName: 'conversations',
});

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD',
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled'),
    defaultValue: 'draft',
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  paidDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  timestamps: true,
  tableName: 'invoices',
});

const Analytics = sequelize.define('Analytics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  metrics: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {
      revenue: 0,
      projects: 0,
      conversations: 0,
      facebookReach: 0,
      instagramEngagement: 0,
      messagesReceived: 0,
      growthRate: 0
    },
  },
}, {
  timestamps: true,
  tableName: 'analytics',
});

// Define associations
User.hasMany(Project, { foreignKey: 'clientId', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'clientId', as: 'client' });

Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

User.hasMany(Task, { foreignKey: 'createdBy', as: 'createdTasks' });
Task.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(File, { foreignKey: 'uploadedBy', as: 'uploadedFiles' });
File.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });

Project.hasMany(File, { foreignKey: 'projectId', as: 'files' });
File.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

Task.hasMany(File, { foreignKey: 'taskId', as: 'files' });
File.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });

User.hasMany(Conversation, { foreignKey: 'createdBy', as: 'createdConversations' });
Conversation.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(Invoice, { foreignKey: 'clientId', as: 'invoices' });
Invoice.belongsTo(User, { foreignKey: 'clientId', as: 'client' });

User.hasMany(Analytics, { foreignKey: 'clientId', as: 'analytics' });
Analytics.belongsTo(User, { foreignKey: 'clientId', as: 'client' });

module.exports = {
  User,
  Project,
  Task,
  File,
  Message,
  Conversation,
  Invoice,
  Analytics,
  sequelize,
};