import { useState } from 'react'
import {
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  MessageSquare
  Users,
  X
import { useKV } from '@github
interfac
  type:
  description:
  read: boo
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
      description: '
 

  const [isOpen, setIsOpen] = useSt
  const unreadCo
 

      case 'task':
      case 'file':
     
      case 'te
      default:
    }

    switch (type) {
        return 'te
        return 'text-gree
        return 'text-purple-500'
      
     
        return
  }
  const markAsRead = (notifi
      current.map(n => 
          ? { ...n, read: true }
      )
  }
  cons
     
    toast.succ

    setNotifications(current => 
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

                </Card>
          )}
      </SheetContent>
  )

























































































































}