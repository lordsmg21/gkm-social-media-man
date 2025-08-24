import { useState } from 'react'


  title: string
  timestamp:
  userId?: string

export function useNo
    {
      type: 'me
      description
 

      type: 'task',
      description: 'Design review ha
      read: false,
  ])
  const unread
  const addNotificatio
      ...notification,
      timestamp: new Date(),
    setNotifications(current => [newNotification, ...c

    se
     
    )

    setNotifications(current =
    )

    setNotificatio

    

    markAllAsRead,


  isOpen: boolean
}
export function NotificationCent

    c
      task: '✅',
   

    return iconMap[type] || iconMap.ot

    switch (type) {
        return 'text-blue-500'
       
     
   

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
  if (!isOpen) return null
interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  notifications?: Notification[]
}  <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
export function NotificationCenter({ isOpen, onClose, notifications: initialNotifications }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications || [
    {
      id: '1',t */}
      type: 'message',t-0 top-0 h-full w-96 bg-white shadow-2xl border-l overflow-hidden flex flex-col">
      title: 'New message from Sarah',
      description: 'Hey! Can we schedule a meeting for tomorrow?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false,-xl">🔔</span>
    },e="text-lg font-semibold text-gray-900">Notifications</h2>
    {0 && (
      id: '2',an className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
      type: 'task',
      title: 'Task completed',
      description: 'Design review has been completed successfully.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
    },
    {
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
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: Notification['type']) => {
    const iconMap = {
      message: '💬',
      task: '✅',
      file: '📄',
      calendar: '📅',
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {notifications.length === 0 ? (
    }
    return iconMap[type] || iconMap.other
  }

  const getIconColor = (type: Notification['type']) => {
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

        </div>
      </div>
    </div>
  )
}}