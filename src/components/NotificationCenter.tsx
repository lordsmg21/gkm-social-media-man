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
        className="fixed inset-0 bg-black/30 notification-overlay" 
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm sm:max-w-lg notification-panel shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-border bg-muted/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-xl">🔔</span>
              <h2 className="text-lg font-semibold text-foreground font-heading">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full font-medium min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Stay updated with your team and projects
          </p>

          <div className="flex justify-between items-center gap-2">
            <span className="text-sm text-muted-foreground flex-shrink-0">
              {notifications.length} notifications
            </span>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors whitespace-nowrap"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 space-y-3 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-4xl mb-4">🔔</div>
              <p className="text-lg font-medium mb-2">No notifications yet</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`p-4 rounded-lg border transition-all hover:shadow-md notification-item w-full ${
                  !notification.read 
                    ? 'border-primary/20 bg-primary/5 shadow-sm' 
                    : 'border-border bg-card hover:border-border/80'
                }`}
              >
                <div className="flex gap-3 w-full">
                  <div className="flex-shrink-0 text-base sm:text-lg">
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0 w-full max-w-full overflow-hidden">
                    <div className="flex items-start justify-between mb-2 gap-2 w-full">
                      <h4 className={`font-medium text-sm leading-tight break-words break-all flex-1 pr-2 ${
                        !notification.read ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3 break-words break-all w-full max-w-full">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between gap-2">
                      {!notification.read && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-xs text-primary font-medium">New</span>
                        </div>
                      )}
                      
                      <div className="flex gap-2 ml-auto flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-primary hover:text-primary/80 font-medium whitespace-nowrap"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => clearNotification(notification.id)}
                          className="text-xs text-destructive hover:text-destructive/80 font-medium whitespace-nowrap"
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