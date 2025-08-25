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
        className="fixed inset-0 bg-black/20 backdrop-blur-sm notification-overlay" 
        onClick={onClose}
      />
      
      {/* Sheet - GKM Glassmorphism Theme */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-md sm:max-w-lg glass-modal shadow-2xl border-l border-border overflow-hidden flex flex-col notification-panel">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-border glass-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 bg-primary/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🔔</span>
              </div>
              <h2 className="text-lg font-semibold font-heading text-foreground">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium min-w-[20px] text-center flex-shrink-0">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Stay updated with your team and projects
          </p>

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">
              {notifications.length} notifications
            </span>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors px-3 py-1 rounded-md hover:bg-primary/10"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Content - Fixed for proper text wrapping and button positioning */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full p-4 pb-6 space-y-4 overflow-y-auto">
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
                  className={`notification-item glass-card p-4 rounded-lg border transition-all hover:shadow-md ${
                    !notification.read 
                      ? 'border-primary/30 bg-primary/5 shadow-sm' 
                      : 'border-border bg-card/50 hover:border-border/80'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 text-lg mt-0.5 w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                      {getIcon(notification.type)}
                    </div>
                    
                    {/* Text container with proper word wrapping */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2 gap-3">
                        <h4 className={`font-medium text-sm leading-snug ${
                          !notification.read ? 'text-foreground font-semibold' : 'text-foreground/80'
                        }`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {notification.message}
                      </p>
                      
                      {/* Status and Buttons - Proper layout to prevent cutoff */}
                      <div className="notification-buttons">
                        <div className="flex items-center justify-between w-full gap-3">
                          {!notification.read && (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                              <span className="text-xs text-primary font-medium">New</span>
                            </div>
                          )}
                          
                          {/* Buttons - Properly spaced and sized */}
                          <div className="flex gap-2 ml-auto">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-primary hover:text-primary/80 font-medium px-3 py-1 rounded-md border border-primary/30 hover:bg-primary/10 transition-colors"
                              >
                                Mark as read
                              </button>
                            )}
                            <button
                              onClick={() => clearNotification(notification.id)}
                              className="text-xs text-destructive hover:text-destructive/80 font-medium px-3 py-1 rounded-md border border-destructive/30 hover:bg-destructive/10 transition-colors"
                            >
                              Clear
                            </button>
                          </div>
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

