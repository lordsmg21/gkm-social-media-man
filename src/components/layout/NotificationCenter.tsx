import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scrollarea'
import { X, Bell, Trash2 } from 'lucide-react'
import { useNotifications } from '@/hooks'
import type { User } from '@/types'
import { formatDateTime } from '@/lib/utils'

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  user: User
}

export function NotificationCenter({ isOpen, onClose, user }: NotificationCenterProps) {
  const { getUserNotifications, markAsRead, deleteNotification, clearAllNotifications, getUnreadCount } = useNotifications()
  
  const userNotifications = getUserNotifications(user.id)
  const unreadCount = getUnreadCount(user.id)

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId)
  }

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotification(notificationId)
  }

  const handleClearAll = () => {
    clearAllNotifications(user.id)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      default: return 'ℹ️'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 notification-overlay" onClick={onClose}>
      <div 
        className="fixed right-0 top-0 h-full w-80 glass-modal shadow-xl border-l border-border/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border/20">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="default" className="text-xs px-2 py-1">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {userNotifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-xs h-7 px-2"
              >
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="p-4 space-y-3">
            {userNotifications.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>No notifications</p>
              </div>
            ) : (
              userNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`glass-card p-4 rounded-lg hover:bg-card/60 transition-colors border-l-4 ${
                    notification.type === 'success' ? 'border-l-green-500' :
                    notification.type === 'warning' ? 'border-l-yellow-500' :
                    notification.type === 'error' ? 'border-l-red-500' :
                    'border-l-blue-500'
                  } ${!notification.read ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <p className="font-medium text-sm text-foreground truncate">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2 break-words">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(notification.timestamp)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="h-6 px-2 text-xs"
                        >
                          Mark read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}