import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  User as UserIcon, 
  Bell, 
  Shield, 
  Globe, 
  Clock, 
  Palette,
  Eye,
  Mail,
  Phone,
  Calendar,
  Save,
  Camera,
  Lock,
  Download,
  Trash2
} from 'lucide-react'
import { User } from '../App'
import { useKV } from '@github/spark/hooks'

interface SettingsViewProps {
  user: User
}

interface UserSettings {
  personalInfo: {
    name: string
    email: string
    phone: string
    bio: string
    avatar: string
  }
  dashboard: {
    defaultView: string
    showKPIs: boolean
    showRecentProjects: boolean
    showTeamMembers: boolean
    compactMode: boolean
  }
  workingHours: {
    timezone: string
    startTime: string
    endTime: string
    workingDays: string[]
    breakHours: { start: string; end: string }
  }
  privacy: {
    profileVisible: boolean
    showOnlineStatus: boolean
    activityTracking: boolean
    shareAnalytics: boolean
  }
  notifications: {
    email: {
      taskUpdates: boolean
      messageReceived: boolean
      projectDeadlines: boolean
      teamMentions: boolean
      weeklyReports: boolean
      clientFeedback: boolean
    }
    push: {
      enabled: boolean
      taskUpdates: boolean
      messageReceived: boolean
      urgentOnly: boolean
      quietHours: { start: string; end: string }
    }
    inApp: {
      taskComments: boolean
      fileSharing: boolean
      systemUpdates: boolean
      projectChanges: boolean
    }
  }
}

export function SettingsView({ user }: SettingsViewProps) {
  const [settings, setSettings] = useKV<UserSettings>(`user-settings-${user.id}`, {
    personalInfo: {
      name: user.name,
      email: user.email,
      phone: '+31 6 12345678',
      bio: user.role === 'admin' ? 'Creative Director at GKM' : 'Client',
      avatar: user.avatar || ''
    },
    dashboard: {
      defaultView: 'dashboard',
      showKPIs: true,
      showRecentProjects: true,
      showTeamMembers: true,
      compactMode: false
    },
    workingHours: {
      timezone: 'Europe/Amsterdam',
      startTime: '09:00',
      endTime: '17:30',
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      breakHours: { start: '12:00', end: '13:00' }
    },
    privacy: {
      profileVisible: true,
      showOnlineStatus: true,
      activityTracking: true,
      shareAnalytics: user.role === 'admin'
    },
    notifications: {
      email: {
        taskUpdates: true,
        messageReceived: true,
        projectDeadlines: true,
        teamMentions: true,
        weeklyReports: user.role === 'admin',
        clientFeedback: user.role === 'admin'
      },
      push: {
        enabled: true,
        taskUpdates: true,
        messageReceived: true,
        urgentOnly: false,
        quietHours: { start: '22:00', end: '08:00' }
      },
      inApp: {
        taskComments: true,
        fileSharing: true,
        systemUpdates: true,
        projectChanges: true
      }
    }
  })

  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  const updateSettings = (section: keyof UserSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const updateNestedSettings = (section: keyof UserSettings, subsection: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...(prev[section] as any)[subsection],
          [field]: value
        }
      }
    }))
    setHasChanges(true)
  }

  const saveSettings = () => {
    // In a real app, this would sync to server
    setHasChanges(false)
  }

  const testNotification = (type: string) => {
    // Simulate notification test
    alert(`Test ${type} notification sent!`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and notifications
          </p>
        </div>
        
        {hasChanges && (
          <Button onClick={saveSettings} className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="gap-2">
            <UserIcon className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="gap-2">
            <Eye className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="w-4 h-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <Lock className="w-4 h-4" />
            Account
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={settings.personalInfo.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {settings.personalInfo.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="sm" className="absolute -bottom-2 -right-2 w-8 h-8 p-0">
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-foreground">{settings.personalInfo.name}</h3>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role === 'admin' ? 'GKM Team' : 'Client'}
                  </Badge>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Camera className="w-4 h-4" />
                    Change Photo
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <Input
                    value={settings.personalInfo.name}
                    onChange={(e) => updateSettings('personalInfo', 'name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email Address</label>
                  <Input
                    type="email"
                    value={settings.personalInfo.email}
                    onChange={(e) => updateSettings('personalInfo', 'email', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Phone Number</label>
                  <Input
                    value={settings.personalInfo.phone}
                    onChange={(e) => updateSettings('personalInfo', 'phone', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Timezone</label>
                  <Input
                    value={settings.workingHours.timezone}
                    onChange={(e) => updateSettings('workingHours', 'timezone', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Bio</label>
                <Textarea
                  placeholder="Tell us a bit about yourself..."
                  value={settings.personalInfo.bio}
                  onChange={(e) => updateSettings('personalInfo', 'bio', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Working Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Start Time</label>
                  <Input
                    type="time"
                    value={settings.workingHours.startTime}
                    onChange={(e) => updateSettings('workingHours', 'startTime', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">End Time</label>
                  <Input
                    type="time"
                    value={settings.workingHours.endTime}
                    onChange={(e) => updateSettings('workingHours', 'endTime', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Working Days</label>
                <div className="flex flex-wrap gap-2">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                    const isSelected = settings.workingHours.workingDays.includes(day)
                    return (
                      <Button
                        key={day}
                        variant={isSelected ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          const newDays = isSelected
                            ? settings.workingHours.workingDays.filter(d => d !== day)
                            : [...settings.workingHours.workingDays, day]
                          updateSettings('workingHours', 'workingDays', newDays)
                        }}
                      >
                        {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dashboard Settings */}
        <TabsContent value="dashboard" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Dashboard Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Show KPI Cards</h4>
                    <p className="text-sm text-muted-foreground">Display key performance indicators on dashboard</p>
                  </div>
                  <Switch
                    checked={settings.dashboard.showKPIs}
                    onCheckedChange={(checked) => updateSettings('dashboard', 'showKPIs', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Show Recent Projects</h4>
                    <p className="text-sm text-muted-foreground">Display your latest project activity</p>
                  </div>
                  <Switch
                    checked={settings.dashboard.showRecentProjects}
                    onCheckedChange={(checked) => updateSettings('dashboard', 'showRecentProjects', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Show Team Members</h4>
                    <p className="text-sm text-muted-foreground">Display team member activity and status</p>
                  </div>
                  <Switch
                    checked={settings.dashboard.showTeamMembers}
                    onCheckedChange={(checked) => updateSettings('dashboard', 'showTeamMembers', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Compact Mode</h4>
                    <p className="text-sm text-muted-foreground">Use smaller cards and reduced spacing</p>
                  </div>
                  <Switch
                    checked={settings.dashboard.compactMode}
                    onCheckedChange={(checked) => updateSettings('dashboard', 'compactMode', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          {/* Email Notifications */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Task Updates</h4>
                  <p className="text-sm text-muted-foreground">When tasks are created, updated, or completed</p>
                </div>
                <Switch
                  checked={settings.notifications.email.taskUpdates}
                  onCheckedChange={(checked) => updateNestedSettings('notifications', 'email', 'taskUpdates', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">New Messages</h4>
                  <p className="text-sm text-muted-foreground">When you receive a new direct message</p>
                </div>
                <Switch
                  checked={settings.notifications.email.messageReceived}
                  onCheckedChange={(checked) => updateNestedSettings('notifications', 'email', 'messageReceived', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Project Deadlines</h4>
                  <p className="text-sm text-muted-foreground">Reminders for upcoming project deadlines</p>
                </div>
                <Switch
                  checked={settings.notifications.email.projectDeadlines}
                  onCheckedChange={(checked) => updateNestedSettings('notifications', 'email', 'projectDeadlines', checked)}
                />
              </div>
              
              {user.role === 'admin' && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">Weekly Reports</h4>
                      <p className="text-sm text-muted-foreground">Summary of team activity and project progress</p>
                    </div>
                    <Switch
                      checked={settings.notifications.email.weeklyReports}
                      onCheckedChange={(checked) => updateNestedSettings('notifications', 'email', 'weeklyReports', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">Client Feedback</h4>
                      <p className="text-sm text-muted-foreground">When clients provide feedback on projects</p>
                    </div>
                    <Switch
                      checked={settings.notifications.email.clientFeedback}
                      onCheckedChange={(checked) => updateNestedSettings('notifications', 'email', 'clientFeedback', checked)}
                    />
                  </div>
                </>
              )}
              
              <div className="pt-4 border-t">
                <Button variant="outline" size="sm" onClick={() => testNotification('email')}>
                  Send Test Email
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Push Notifications */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Push Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Enable Push Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive notifications even when app is closed</p>
                </div>
                <Switch
                  checked={settings.notifications.push.enabled}
                  onCheckedChange={(checked) => updateNestedSettings('notifications', 'push', 'enabled', checked)}
                />
              </div>
              
              {settings.notifications.push.enabled && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">Urgent Only</h4>
                      <p className="text-sm text-muted-foreground">Only show high-priority notifications</p>
                    </div>
                    <Switch
                      checked={settings.notifications.push.urgentOnly}
                      onCheckedChange={(checked) => updateNestedSettings('notifications', 'push', 'urgentOnly', checked)}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Quiet Hours</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-muted-foreground">Start</label>
                        <Input
                          type="time"
                          value={settings.notifications.push.quietHours.start}
                          onChange={(e) => {
                            const newQuietHours = { ...settings.notifications.push.quietHours, start: e.target.value }
                            updateNestedSettings('notifications', 'push', 'quietHours', newQuietHours)
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-muted-foreground">End</label>
                        <Input
                          type="time"
                          value={settings.notifications.push.quietHours.end}
                          onChange={(e) => {
                            const newQuietHours = { ...settings.notifications.push.quietHours, end: e.target.value }
                            updateNestedSettings('notifications', 'push', 'quietHours', newQuietHours)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <div className="pt-4 border-t">
                <Button variant="outline" size="sm" onClick={() => testNotification('push')}>
                  Send Test Push
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Profile Visibility</h4>
                  <p className="text-sm text-muted-foreground">Allow other team members to see your profile</p>
                </div>
                <Switch
                  checked={settings.privacy.profileVisible}
                  onCheckedChange={(checked) => updateSettings('privacy', 'profileVisible', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Show Online Status</h4>
                  <p className="text-sm text-muted-foreground">Let others see when you're online</p>
                </div>
                <Switch
                  checked={settings.privacy.showOnlineStatus}
                  onCheckedChange={(checked) => updateSettings('privacy', 'showOnlineStatus', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Activity Tracking</h4>
                  <p className="text-sm text-muted-foreground">Track your activity for productivity insights</p>
                </div>
                <Switch
                  checked={settings.privacy.activityTracking}
                  onCheckedChange={(checked) => updateSettings('privacy', 'activityTracking', checked)}
                />
              </div>
              
              {user.role === 'admin' && (
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Share Analytics</h4>
                    <p className="text-sm text-muted-foreground">Include your data in team analytics</p>
                  </div>
                  <Switch
                    checked={settings.privacy.shareAnalytics}
                    onCheckedChange={(checked) => updateSettings('privacy', 'shareAnalytics', checked)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Management */}
        <TabsContent value="account" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Lock className="w-4 h-4" />
                Change Password
              </Button>
              
              <Button variant="outline" className="w-full justify-start gap-3">
                <Shield className="w-4 h-4" />
                Two-Factor Authentication
              </Button>
              
              <Button variant="outline" className="w-full justify-start gap-3">
                <Download className="w-4 h-4" />
                Export My Data
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}