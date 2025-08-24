import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Bell,
  MessageSquare,
  Calendar,
  FileText,
  Users,
  CheckCircle,
  X,
  Trash2
} from 'lucide-react'
import { User } from '../App'
import { toast } from 'sonner'

export interface Notification {
  id: string
  type: 'message' | 'task' | 'deadline' | 'file' | 'team' | 'system'
  title: string
  message: string
  timestamp: Date
  read: boolean
  userId: string
  actionData?: {
    taskId?: string
    projectId?: string
    conversationId?: string
    fileId?: string
  }
}

interface NotificationCenterProps {
  user: User
  children: React.ReactNode
}

export function NotificationCenter({ user, children }: NotificationCenterProps) {
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', [])
  const [isOpen, setIsOpen] = useState(false)

  // Initialize with some sample notifications for demo purposes
  useEffect(() => {
    if (notifications.length === 0) {
      const sampleNotifications: Notification[] = [
        {
          id: '1',
          type: 'message',
          title: 'New Message',
          message: 'Sarah heeft je een bericht gestuurd in het Instagram project',
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          read: false,
          userId: user.id
        },
        {
          id: '2',
          type: 'task',
          title: 'Task Updated',
          message: 'Instagram Content Creation is verplaatst naar Review',
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          read: false,
          userId: user.id,
          actionData: { taskId: 'task-1' }
        },
        {
          id: '3',
          type: 'deadline',
          title: 'Deadline Reminder',
          message: 'Facebook Campaign deadline is morgen om 15:00',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          read: true,
          userId: user.id
        },
        {
          id: '4',
          type: 'file',
          title: 'File Uploaded',
          message: 'Nieuwe design bestanden toegevoegd aan Social Media Project',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          read: true,
          userId: user.id
        },
        {
          id: '5',
          type: 'team',
          title: 'Team Update',
          message: 'Alex van der Berg is nu online',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          read: true,
          userId: user.id
        }
      ]
      setNotifications(sampleNotifications)
    }
  }, [notifications.length, setNotifications, user.id])

  const unreadCount = notifications.filter(n => !n.read && n.userId === user.id).length

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-4 h-4 text-blue-500" />
      case 'task':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'deadline':
        return <Calendar className="w-4 h-4 text-orange-500" />
      case 'file':
        return <FileText className="w-4 h-4 text-purple-500" />
      case 'team':
        return <Users className="w-4 h-4 text-indigo-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(currentNotifications =>
      currentNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(currentNotifications =>
      currentNotifications.map(notification =>
        notification.userId === user.id
          ? { ...notification, read: true }
          : notification
      )
    )
    toast.success('All notifications marked as read')
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(currentNotifications =>
      currentNotifications.filter(notification => notification.id !== notificationId)
    )
    toast.success('Notification deleted')
  }

  const clearAll = () => {
    setNotifications(currentNotifications =>
      currentNotifications.filter(notification => notification.userId !== user.id)
    )
    toast.success('All notifications cleared')
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Nu'
    if (minutes < 60) return `${minutes}m geleden`
    if (hours < 24) return `${hours}u geleden`
    if (days === 1) return 'Gisteren'
    if (days < 7) return `${days}d geleden`
    return timestamp.toLocaleDateString('nl-NL')
  }

  const userNotifications = notifications.filter(n => n.userId === user.id)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="relative">
          {children}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 text-xs min-w-[20px] h-5 flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </SheetTrigger>
      <SheetContent side="right" className="w-96 glass-modal">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </div>
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
        </SheetHeader>

        <div className="flex items-center justify-between mt-4 mb-4">
          <p className="text-sm text-muted-foreground">
            {userNotifications.length} notifications
          </p>
          {userNotifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear all
            </Button>
          )}
        </div>

        <ScrollArea className="h-[calc(100vh-180px)]">
          {userNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-medium text-foreground mb-2">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                You're all caught up! New notifications will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {userNotifications
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((notification, index) => (
                  <div key={notification.id}>
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        !notification.read ? 'bg-accent/10 border-accent/20' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`text-sm font-medium ${
                                !notification.read ? 'text-foreground' : 'text-muted-foreground'
                              }`}>
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-2">
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteNotification(notification.id)
                                  }}
                                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10"
                                >
                                  <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatTimestamp(new Date(notification.timestamp))}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    {index < userNotifications.length - 1 && <Separator />}
                  </div>
                ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

// Hook to add new notifications
export function useNotifications() {
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', [])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    }

    setNotifications(currentNotifications => [newNotification, ...currentNotifications])
    
    // Show toast for immediate feedback
    toast.info(notification.title, {
      description: notification.message,
    })

    return newNotification
  }

  return { notifications, addNotification }
}