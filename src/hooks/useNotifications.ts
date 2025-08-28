import { useKV } from '@github/spark/hooks'
import type { Notification } from '@/types'

export function useNotifications() {
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', [])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    }
    
    setNotifications(current => [newNotification, ...current])
    return newNotification
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(current => 
      current.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = (userId: string) => {
    setNotifications(current => 
      current.map(notif => 
        notif.userId === userId ? { ...notif, read: true } : notif
      )
    )
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(current => current.filter(notif => notif.id !== notificationId))
  }

  const clearAllNotifications = (userId: string) => {
    setNotifications(current => current.filter(notif => notif.userId !== userId))
  }

  const getUserNotifications = (userId: string) => {
    return notifications
      .filter(notif => notif.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  const getUnreadCount = (userId: string) => {
    return notifications.filter(notif => notif.userId === userId && !notif.read).length
  }

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getUserNotifications,
    getUnreadCount
  }
}