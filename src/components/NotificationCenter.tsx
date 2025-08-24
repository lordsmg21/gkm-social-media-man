import { useState } from 'react'
import { useKV } from '@github/spark/hooks'

interface Notification {
  id: string
  type: 'message' | 'task' | 'file' | 'calendar' | 'team' | 'deadline' | 'other'
  title: string
  message: string
  timestamp: Date
  read: boolean
  userId?: string
  actionData?: any
}

export function useNotifications() {
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', [
    {
      id: '1',
      type: 'message',
      title: 'New message from Sarah',
      message: 'Hey! Can we schedule a meeting for tomorrow?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false,
    },
    {
      id: '2',
      type: 'task',
      title: 'Task completed',
      message: 'Design review has been completed successfully.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
    },
    {
      id: '3',
      type: 'file',
      title: 'File uploaded',
      message: 'Project specifications.pdf has been uploaded.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: true,
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
    notifications: notifications || [],
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
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🔔</span>
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                {unreadCount}
              </span>
            )}
            <button
              onClick={onClose}
              className="ml-auto p-1 rounded-md hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Stay updated with your team and projects
          </p>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {notifications.length} notifications
            </span>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
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
                    ? 'border-blue-200 bg-blue-50 shadow-sm' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 text-lg">
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className={`font-medium text-sm leading-tight ${
                        !notification.read ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      {!notification.read && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span className="text-xs text-blue-600 font-medium">New</span>
                        </div>
                      )}
                      
                      <div className="flex gap-2 ml-auto">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => clearNotification(notification.id)}
                          className="text-xs text-red-600 hover:text-red-800 font-medium"
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
  )
}

// Export the NotificationCenter component
export { NotificationCenter }