import { useState } from 'react'

interface Notification {
  id: string
  type: 'message' | 'task' | 'file' | 'calendar' | 'team' | 'deadline' | 'other'
  title: string
  message: string
  timestamp: Date
  read: boolean
  userId?: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'message',
      title: 'New message from Sarah Johnson regarding project timeline adjustments',
      message: 'Hey! Can we schedule a meeting for tomorrow to discuss the project timeline adjustments and review the latest design mockups?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false,
    },
    {
      id: '2',
      type: 'task',
      title: 'Instagram Campaign Design Task has been completed successfully',
      message: 'The Instagram campaign design review has been completed successfully and is ready for your approval before we proceed to the next phase.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
    },
    {
      id: '3',
      type: 'file',
      title: 'New file uploaded to your project folder by team member',
      message: 'Project specifications document v2.1 final.pdf has been uploaded to your project folder and requires immediate review.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: true,
    },
    {
      id: '4',
      type: 'deadline',
      title: 'Upcoming project deadline reminder for Facebook campaign',
      message: 'Your Facebook ad campaign is scheduled to go live tomorrow at 9:00 AM. Please review all materials before the deadline.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: false,
    }
  ])

  const unreadCount = (notifications || []).filter(n => !n.read).length

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    setNotifications(current => [newNotification, ...(current || [])])
  }

  const markAsRead = (id: string) => {
    setNotifications(current =>
      (current || []).map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(current =>
      (current || []).map(notification => ({ ...notification, read: true }))
    )
  }

  const clearNotification = (id: string) => {
    setNotifications(current => (current || []).filter(n => n.id !== id))
  }

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
  }
}

export function NotificationCenter({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications()

  const getIcon = (type: Notification['type']) => {
    const iconMap = {
      message: '💬',
      task: '✅',
      file: '📄',
      calendar: '📅',
      team: '👥',
      deadline: '⏰',
      other: '🔔'
    }
    return iconMap[type] || iconMap.other
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Sheet - Properly sized for long text */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-xl flex-shrink-0">🔔</span>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium min-w-[20px] text-center flex-shrink-0">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex-shrink-0 ml-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Stay updated with your team and projects
          </p>

          <div className="flex justify-between items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
              {notifications.length} notifications
            </span>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Content - Fixed for long text */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full p-4 pb-6 space-y-4 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-4">🔔</div>
                <p className="text-lg font-medium mb-2">No notifications yet</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                    !notification.read 
                      ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20 shadow-sm' 
                      : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 text-lg mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    
                    {/* Text container with proper wrapping */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-start justify-between mb-2 gap-3">
                        <h4 className={`font-medium text-sm leading-5 ${
                          !notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap flex-shrink-0">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-5 mb-3">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        {!notification.read && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">New</span>
                          </div>
                        )}
                        
                        <div className="flex gap-3 ml-auto">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => clearNotification(notification.id)}
                            className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const { notifications, unreadCount, addNotification } = useNotifications()

  const handleAddNotification = () => {
    const types: Array<'message' | 'task' | 'file' | 'calendar' | 'team' | 'deadline'> = 
      ['message', 'task', 'file', 'calendar', 'team', 'deadline']
    const randomType = types[Math.floor(Math.random() * types.length)]
    
    const sampleNotifications = {
      message: { title: 'New urgent message from team lead about project changes', message: 'We need to discuss the recent changes to the project scope and timeline adjustments that were requested by the client.' },
      task: { title: 'High priority task requires your immediate attention', message: 'The design mockups for the new landing page need to be reviewed and approved before the end of day.' },
      file: { title: 'Important document has been shared with you', message: 'The final project specifications and requirements document has been uploaded and needs your review.' },
      calendar: { title: 'Meeting reminder for important client presentation', message: 'Don\'t forget about the client presentation scheduled for tomorrow at 2:00 PM in the main conference room.' },
      team: { title: 'Team announcement regarding new project assignment', message: 'A new team member has been assigned to work on the upcoming marketing campaign project.' },
      deadline: { title: 'Project deadline is approaching soon', message: 'The final deliverables for the website redesign project are due in 2 days. Please ensure all tasks are completed.' }
    }
    
    addNotification({
      type: randomType,
      title: sampleNotifications[randomType].title,
      message: sampleNotifications[randomType].message,
      read: false,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Notification System Demo</h1>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-400">Manage your notifications and stay up to date</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleAddNotification}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <span>➕</span>
                Add Notification
              </button>
              
              <button
                onClick={() => setIsNotificationOpen(true)}
                className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <span className="text-lg">🔔</span>
                <span>Open Notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">💬</span>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Messages</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{notifications.filter(n => n.type === 'message' && !n.read).length} unread</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">✅</span>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Tasks</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{notifications.filter(n => n.type === 'task').length} total</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📄</span>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Files</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{notifications.filter(n => n.type === 'file').length} total</p>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">⏰</span>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Deadlines</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{notifications.filter(n => n.type === 'deadline').length} total</p>
            </div>
          </div>
        </div>
      </div>

      <NotificationCenter 
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  )
}