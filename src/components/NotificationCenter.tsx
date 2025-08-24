import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Bell,
  CheckCircle,
  Calendar,
  MessageSquare,
  FileText,
  Users,
  Clock,
  X
} from 'lucide-react'
import { useKV } from '@github/spark/hooks'

interface Notification {
  id: string
  type: 'message' | 'task' | 'file' | 'calendar' | 'team'
  title: string
  description: string
  timestamp: Date
  read: boolean
  userId?: string
  projectId?: string
}

interface NotificationCenterProps {
  userId: string
}

export function NotificationCenter({ userId }: NotificationCenterProps) {
  const [notifications, setNotifications] = useKV<Notification[]>(`notifications-${userId}`, [
    {
      id: '1',
      type: 'message',
      title: 'New Message',
      description: 'Alex sent you a message in Project Alpha',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
      userId: 'alex-123',
      projectId: 'project-alpha'
    },
    {
      id: '2',
      type: 'task',
      title: 'Task Updated',
      description: 'Website Redesign moved to Review',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      projectId: 'project-beta'
    },
    {
      id: '3',
      type: 'calendar',
      title: 'Meeting Reminder',
      description: 'Client review meeting in 15 minutes',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      read: true
    }
  ])

  const [isOpen, setIsOpen] = useState(false)

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

  const removeNotification = (notificationId: string) => {
    setNotifications(current => 
      current.filter(n => n.id !== notificationId)
    )
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return timestamp.toLocaleDateString()
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-80 glass-modal">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
          </SheetTitle>
          <SheetDescription>
            Stay updated with your latest activities
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all cursor-pointer ${
                    !notification.read 
                      ? 'bg-accent/10 border-accent/20' 
                      : 'bg-card/50'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`${getIconColor(notification.type)} mt-0.5`}>
                        {getIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium leading-tight">
                            {notification.title}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeNotification(notification.id)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {notification.description}
                        </p>
                        
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(notification.timestamp)}
                        </div>
                      </div>
                      
                      {!notification.read && (
                        <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}