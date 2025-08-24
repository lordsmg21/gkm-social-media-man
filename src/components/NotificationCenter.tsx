import { useState } from 'react'

interface Notification {
  id: string
  type: 'message' | 'task' | 'file' | 'calendar' | 'other'
  title: string
  description: string
  timestamp: Date
  read: boolean
  userId?: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'message',
      title: 'New message from Sarah',
      description: 'Hey! Can we schedule a meeting for tomorrow?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false,
    },
    {
      id: '2',
      type: 'task',
      title: 'Task completed',
      description: 'Design review has been completed successfully.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    setNotifications(current => [newNotification, ...current])
  }

  const markAsRead = (id: string) => {
    setNotifications(current =>
      current.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(current =>
      current.map(notification => ({ ...notification, read: true }))
    )
  }

  const clearNotification = (id: string) => {
    setNotifications(current => current.filter(n => n.id !== id))
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

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  notifications?: Notification[]
}

export function NotificationCenter({ isOpen, onClose, notifications: initialNotifications }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications || [
    {
      id: '1',
      type: 'message',
      title: 'New message from Sarah',
      description: 'Hey! Can we schedule a meeting for tomorrow?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false,
    },
    {
      id: '2',
      type: 'task',
      title: 'Task completed',
      description: 'Design review has been completed successfully.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: Notification['type']) => {
    const iconMap = {
      message: '💬',
      task: '✅',
      file: '📄',
      calendar: '📅',
      other: '🔔'
    }
    return iconMap[type] || iconMap.other
  }

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return 'text-blue-500'
      case 'task':
        return 'text-green-500'
      case 'file':
        return 'text-purple-500'
      case 'calendar':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(current =>
      current.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(current =>
      current.map(notification => ({ ...notification, read: true }))
    )
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
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l overflow-hidden flex flex-col">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔔</span>
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {unreadCount}
                </span>
              )}
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
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
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">🔔</span>
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  !notification.read 
                    ? 'border-blue-200 bg-blue-50 shadow-sm' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 text-lg">
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-gray-900 truncate pr-2">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {notification.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}