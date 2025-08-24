import { useState } from 'react'
import { toast } from 'sonner'
import { toast } from 'sonner'
  SheetD
  Sheet,
import { Card }
import {
  Calendar,
  Clock,
  MessageSquare,
  X

import {
  title
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
      descripti
  description: string
    {
  read: boolean
  userId?: string
}

interface NotificationCenterProps {
  isOpen: boolean
      read: true
 

  const getIcon = (type: Notification['type']) => {
      case 'message':
     
      case 'fi
      case 'calendar':
      case 'team':
      default:
    }

    sw
     
        return
        return 'tex
        return 'text-orange-50
        return 'text-indigo-500'
        return 'text-gray-500'
  }
  cons
     
          ? { 
      )
  }
  const markAllAsRead = () => {
      current.map(n => ({ ...n, read: true }))
      read: true

    s
    )
  }
  const formatTime = (timestamp:
    const diff = now.getTime() - timestamp.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    i
    

    <Sheet open={isOpen} onOpenChange={onClose}>

  const getIcon = (type: Notification['type']) => {
            {unread
      case 'message':
            )}
          <SheetDe
          </SheetDescription>

          <div className="flex justify-between 
      case 'calendar':
            {unreadCount > 0 && (
      case 'team':
            )}
      default:
            {notifications.length === 0 ? (
    }
   

                  key={notification.id}
                   
                  onC
                  <div classNa
                  
                    <div classN
                  
                        }`}>
                      
                          <div c
                  
        return 'text-indigo-500'
              
        return 'text-gray-500'
     
  }

                      </div>
                        !notific
                       
                      {!notifica
                      )}
             
      )
     
  }

  const markAllAsRead = () => {

      current.map(n => ({ ...n, read: true }))
    )

  }










    const diff = now.getTime() - timestamp.getTime()

    const hours = Math.floor(diff / (1000 * 60 * 60))









    <Sheet open={isOpen} onOpenChange={onClose}>



            <Bell className="h-5 w-5" />





            )}



          </SheetDescription>







            {unreadCount > 0 && (



            )}



            {notifications.length === 0 ? (







                  key={notification.id}













                        }`}>



















                      </div>







                      )}










