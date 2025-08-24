import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import {
  X,
  MessageSquare,
import { Us
  FileText,
  userId

  us

  const [notification
  // Generate sample notifica
    if (notifications.length === 0) {
        {

          message: 'Hoi! Ik heb
          re
        },
          id: '
          title: 
          timesta
          userI
        {
 

          read: true,
        }
 

  const unreadCount = notifications.filter(n => !n.read).length
  const getIcon = (type: Notification['type']) => {

      case 'task':
      case 'deadlin
      case 'file':
      case 'team':
      def
    }

    setNotifications(currentNotifications =
        n.id === notificationId ? { ...n, read: true } : n
    )

    setNotifications(curr
    )

    setNotifications(cur
    )

    const now = new Date()
    const minutes = Math.floor(diff / (1000 * 60))
    const days = Math.
    if (minutes < 60) {
    } else
    } els
    }

    <Sheet>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 && (
              {unread
          )}
      </S
       
            <SheetTitle>Notificaties</Sheet
     
              </Button>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">

                !notification.read ? 'border-primar
                <Ca
                    <
                    </div>
                  
                          <h4 className={`text-sm font-medium ${
                      
                          </h4>
                  
                          <p className="text-xs text-muted-fore
                  
                        <div className="flex items-center ga
              
        return <Bell className="w-4 h-4 text-gray-500" />
    }
   

  const markAsRead = (notificationId: string) => {
    setNotifications(currentNotifications =>
      currentNotifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    )
   

  const markAllAsRead = () => {
    setNotifications(currentNotifications =>
      currentNotifications.map(n => ({ ...n, read: true }))
    )
  )

  const deleteNotification = (notificationId: string) => {
    setNotifications(currentNotifications =>
      currentNotifications.filter(n => n.id !== notificationId)
     
  }

  const formatTime = (date: Date) => {

    const diff = now.getTime() - date.getTime()

    const hours = Math.floor(diff / (1000 * 60 * 60))


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

            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">

            </span>

        </Button>

      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Notificaties</SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Alles markeren als gelezen

            )}

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