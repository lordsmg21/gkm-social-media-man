export type UserRole = 'admin' | 'client'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  isOnline?: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: 'low' | 'medium' | 'high'
  assignedTo: string[]
  dueDate?: string
  createdAt: string
  client?: string
  tags?: string[]
  files?: TaskFile[]
  projectId?: string
}

export interface TaskFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: string
  uploadedBy: string
}

export interface Project {
  id: string
  name: string
  description: string
  client: string
  budget: number
  trajectory: string
  createdAt: string
  status: 'active' | 'completed' | 'on-hold'
}

export interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  senderAvatar?: string
  timestamp: string
  type: 'text' | 'file' | 'task-mention' | 'user-mention'
  conversationId: string
  files?: MessageFile[]
  mentions?: string[]
}

export interface MessageFile {
  id: string
  name: string
  size: number
  type: string
  url: string
}

export interface Conversation {
  id: string
  type: 'direct' | 'group'
  name?: string
  participants: string[]
  lastMessage?: Message
  updatedAt: string
  isActive: boolean
}

export interface ClientData {
  id: string
  monthlyRevenue: number
  activeProjects: number
  leadGeneration: number
  facebookReach: number
  instagramEngagement: number
  messagesReceived: number
  growthRate: number
}

export interface FileUpload {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: string
  uploadedBy: string
  targetUsers: string[] | 'all'
  category: 'general' | 'invoice' | 'project'
}

export interface Notification {
  id: string
  title: string
  description: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: string
  read: boolean
  userId: string
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  type: 'meeting' | 'deadline' | 'publication' | 'campaign' | 'standup'
  attendees?: string[]
  projectId?: string
}