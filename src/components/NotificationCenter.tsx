import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components
import { Separator } from '@/components/ui/separator'
import {
  SheetContent,
  SheetT
} from '
  Bell,
  Calendar,
  Users,
  X,
} from 'lucide-react'
import {

  id: string
  title: st
  FileText,
  Users,
  CheckCircle,
  X,
  Trash2
} from 'lucide-react'
import { User } from '../App'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

export interface Notification {
  id: string
  type: 'message' | 'task' | 'deadline' | 'file' | 'team' | 'system'
  title: string
  message: string
  timestamp: Date
          userI
        },
          id: '3',
 

          userId: user.id
        {
 

          read: true,
        },

          title: 'T
          timestamp: new Date(Date.no
          userId: user.id
      ]
    }


    switch (type) {
        return <MessageSquare className="w-4 h-4 text-blue-500" />
        return <CheckC
        return <Calendar 
        re
        r
        return <Be
  }
  const markAsRead = (notificati
      currentNotifications.map(n =>
      )
  }
  const markAllAsRead = ()
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
      currentNotifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
     
  }

  const markAllAsRead = () => {
    setNotifications(currentNotifications =>
      currentNotifications.map(n => ({ ...n, read: true }))
     
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(currentNotifications =>
      currentNotifications.filter(n => n.id !== notificationId)
    )
  }

  const formatTime = (date: Date) => {
                          
    const diff = now.getTime() - date.getTime()
                              onClick={() => markA
    const hours = Math.floor(diff / (1000 * 60 * 60))
                            </Button>

    if (minutes < 60) {
      return `${minutes}m geleden`
    } else if (hours < 24) {
      return `${hours}h geleden`
    } else {
      return `${days}d geleden`
     
  }

  return (
           
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
        </ScrollArea>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
  )
            </span>
export funct
        </Button>
  const addNotificati
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Notificaties</SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Alles markeren als gelezen
  }
            )}
}
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <div className="space-y-4">

              <Card key={notification.id} className={`${
                !notification.read ? 'border-primary/20 bg-primary/5' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${
                            !notification.read ? 'text-foreground' : 'text-muted-foreground'

                            {notification.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">


                          <p className="text-xs text-muted-foreground mt-2">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"

                              className="w-6 h-6"
                              onClick={() => markAsRead(notification.id)}
                            >

                            </Button>
                          )}
                          <Button

                            size="icon"
                            className="w-6 h-6"
                            onClick={() => deleteNotification(notification.id)}

                            <X className="w-3 h-3" />
                          </Button>
                        </div>

                    </div>
                  </div>
                </CardContent>

            ))}
            {notifications.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Geen notificaties</p>
              </div>
            )}

        </ScrollArea>

    </Sheet>

}

export function useNotifications() {
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', [])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    }
    setNotifications(currentNotifications => [newNotification, ...currentNotifications])
    

    toast(notification.title, {

    })


  return { notifications, addNotification }
}