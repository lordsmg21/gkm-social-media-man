import { useState } from 'react'
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
  MessageSquare,
  FileText,
  Users,
  Clock,
  X,
  Bell,
  CheckCircle,
  Calendar
} from 'lucide-react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

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
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', [
    {
      id: '1',
      type: 'message',
      title: 'New message from Sarah',
      description: 'Project files are ready for review',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false
    },
    {
      id: '2',
      type: 'task',
      title: 'Task completed',
      description: 'Instagram campaign design has been completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      read: false
    },
    {
      id: '3',
      type: 'file',
      title: 'File uploaded',
      description: 'New brand assets uploaded to project folder',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: true
    },
    {
      id: '4',
      type: 'calendar',
      title: 'Upcoming meeting',
      description: 'Client review meeting in 15 minutes',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
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
        return 'text-purple-500'
      case 'calendar':
        return 'text-orange-500'
      case 'team':
        return 'text-indigo-500'
      default:
        return 'text-gray-500'
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(current => 
      current.map(n => 
        n.id === notificationId 
          ? { ...n, read: true }
          : n
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(current => 
      current.map(n => ({ ...n, read: true }))
    )
    toast.success('All notifications marked as read')
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(current => 
      current.filter(n => n.id !== notificationId)
    )
    toast.success('Notification deleted')
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </SheetTitle>
          <SheetDescription>
            Stay updated with your latest activities
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-muted-foreground">
              Recent Activity
            </h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>

          <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    !notification.read ? 'border-primary/50 bg-primary/5' : ''
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`${getIconColor(notification.type)} mt-1`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className={`text-sm font-medium truncate ${
                          !notification.read ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2 ml-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatTime(notification.timestamp)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className={`text-sm mt-1 line-clamp-2 ${
                        !notification.read ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
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
        </div>
      </SheetContent>
    </Sheet>
  )
}