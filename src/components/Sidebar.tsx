import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  MessageSquare, 
  FolderOpen, 
  Calendar, 
  Users, 
  Settings,
  Hexagon,
  Bell,
  LogOut
} from 'lucide-react'
import { User } from '../App'
import { NotificationCenter, useNotifications } from './NotificationCenter'

interface SidebarProps {
  user: User
  activeView: string
  onViewChange: (view: string) => void
}

export function Sidebar({ user, activeView, onViewChange }: SidebarProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const { unreadCount } = useNotifications()
  
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      roles: ['admin', 'client']
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      roles: ['admin', 'client'],
      badge: '3'
    },
    {
      id: 'projects',
      label: 'My Projects',
      icon: Users,
      roles: ['admin', 'client']
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      roles: ['admin', 'client']
    },
    {
      id: 'files',
      label: 'Files',
      icon: FolderOpen,
      roles: ['admin', 'client']
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      roles: ['admin', 'client']
    }
  ]

  const visibleItems = menuItems.filter(item => 
    item.roles.includes(user.role)
  )

  return (
    <div className="w-64 bg-card/50 backdrop-blur-sm border-r border-border min-h-screen flex flex-col">
      <div className="p-6 flex flex-col flex-1">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Hexagon className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-xl text-foreground">GKM</h1>
            <p className="text-sm text-muted-foreground">Portal</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="glass-card rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm text-foreground truncate">{user.name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                  {user.role === 'admin' ? 'Admin' : 'Client'}
                </Badge>
                {user.isOnline && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {visibleItems.map((item) => {
            const IconComponent = item.icon
            const isActive = activeView === item.id
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11",
                  isActive && "bg-primary text-primary-foreground shadow-sm"
                )}
                onClick={() => onViewChange(item.id)}
              >
                <IconComponent className="w-4 h-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge variant="destructive" className="text-xs min-w-[20px] h-5">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            )
          })}
        </nav>

        {/* Notifications & Logout */}
        <div className="mt-auto space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-11 relative"
            onClick={() => setIsNotificationOpen(true)}
          >
            <Bell className="w-4 h-4" />
            <span className="flex-1 text-left">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="min-w-[20px] h-5 p-0 text-xs flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-11 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              // Reset user session and refresh page
              localStorage.clear()
              sessionStorage.clear()
              window.location.reload()
            }}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
      
      <NotificationCenter 
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  )
}