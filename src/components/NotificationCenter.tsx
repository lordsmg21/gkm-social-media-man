import { useState } from 'react'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Users,
  X
} from 'lucide-react'

interface Notification {
  id: string
  type: 'message' | 'task' | 'file' | 'calendar' | 'team'
  title: string
  description: string
  timestamp: Date
  read: boolean
  userId?: string
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'message',
      title: 'New Message',
      description: 'Sarah sent you a message about the Instagram campaign',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false
    },
    {
      id: '2',
      type: 'task',
      title: 'Task Completed',
      description: 'Facebook post design has been completed',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false
    },
    {
      id: '3',
      type: 'calendar',
      title: 'Upcoming Meeting',
      description: 'Client review meeting in 30 minutes',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      read: true
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4" />
      case 'task':
        return <CheckCircle className="h-4 w-4" />
      case 'file':
        return <FileText className="h-4 w-4" />
      case 'calendar':
        return <Calendar className="h-4 w-4" />
      case 'team':
        return <Users className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return 'text-blue-500'
      case 'task':
        return 'text-green-500'
      case 'file':
        return 'text-orange-500'
      case 'calendar':
        return 'text-indigo-500'
      case 'team':
        return 'text-purple-500'
      default:
        return 'text-gray-500'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(current =>
      current.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(current =>
      current.map(n => ({ ...n, read: true }))
    )
    toast.success('All notifications marked as read')
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `${minutes}m ago`
    }
    return `${hours}h ago`
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[400px] glass-modal">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </SheetTitle>
          <SheetDescription>
            Stay updated with your team and projects
          </SheetDescription>

          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-muted-foreground">
              {notifications.length} notifications
            </span>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={markAllAsRead}
              >
                Mark all as read
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  !notification.read ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex gap-3">
                  <div className={`flex-shrink-0 ${getIconColor(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate">
                        {notification.title}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {notification.description}
                    </p>
                    
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}