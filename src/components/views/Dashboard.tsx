import { useState } from 'react'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Target, 
  Facebook, 
  Instagram, 
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Eye,
  Heart,
  ArrowUp,
  ArrowDown,
  Calendar,
  Filter,
  Download,
  BarChart3,
  LineChart,
  PieChart,
  Plus,
  Edit,
  Settings,
  Link
} from 'lucide-react'
import type { User } from '../../types'
import { useKV, useSocialMediaSync } from '../../hooks'
import { AdminDataManagerWrapper as AdminDataManager } from '../shared/AdminDataManagerWrapper'
import { SocialMediaIntegration } from '../SocialMediaIntegration'
import { CampaignAnalytics } from '../CampaignAnalytics'
import { toast } from 'sonner'
  ArrowDown,
  Calendar,
  Filter,
  Download,
  BarChart3,
  LineChart,
  PieChart,
  Plus,
  Edit,
  Link
} from 'lucide-react'
import type { User } from '../../types'
import { useKV, useSocialMediaSync } from '../../hooks'
import { AdminDataManagerWrapper as AdminDataManager } from '../AdminDataManagerWrapper'
import { SocialMediaIntegration } from '../SocialMediaIntegration'
import { CampaignAnalytics } from '../CampaignAnalytics'
import { toast } from 'sonner'

interface RecentProject {
  id: string
  name: string
  client: string
  status: 'in-progress' | 'review' | 'to-do' | 'completed'
  progress: number
  deadline: string
  team: string[]
}

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  isOnline: boolean
}

interface KPIData {
  revenue: number
  revenueGrowth: number
  projects: number
  projectsGrowth: number
  teamMembers: number
  conversations: number
  conversationsGrowth: number
  facebookReach: number
  facebookReachGrowth: number
  instagramEngagement: number
  instagramEngagementGrowth: number
  messagesReceived: number
  messagesGrowth: number
  growthRate: number
  projectBudget: number
  budgetUsed: number
  clientId?: string // Optional client ID for client-specific data
}

interface ChartData {
  name: string
  revenue: number
  conversations: number
  messagesReceived: number
  facebookReach: number
  instagramEngagement: number
  date: string
  clientId?: string // Optional client ID for client-specific data
}

interface DashboardProps {
  user: User
}

export function Dashboard({ user }: DashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedChart, setSelectedChart] = useState('revenue')
  const [showAdminManager, setShowAdminManager] = useState(false)
  const [showSocialIntegration, setShowSocialIntegration] = useState(false)
  const [showCampaignAnalytics, setShowCampaignAnalytics] = useState(false)

  // Use social media sync hook to get real-time campaign data
  const { sync } = useSocialMediaSync()

  // Calculate real-time social media metrics from synced campaigns
  const realTimeSocialMetrics = React.useMemo(() => {
    const facebookCampaigns = sync.campaigns.filter(c => c.platform === 'facebook')
    const instagramCampaigns = sync.campaigns.filter(c => c.platform === 'instagram')
    
    const facebookReach = facebookCampaigns.reduce((sum, c) => sum + c.reach, 0)
    const instagramReach = instagramCampaigns.reduce((sum, c) => sum + c.reach, 0)
    const instagramClicks = instagramCampaigns.reduce((sum, c) => sum + c.clicks, 0)
    const instagramImpressions = instagramCampaigns.reduce((sum, c) => sum + c.impressions, 0)
    
    // Calculate engagement rate for Instagram
    const instagramEngagement = instagramImpressions > 0 
      ? ((instagramClicks / instagramImpressions) * 100) 
      : 0

    return {
      facebookReach,
      instagramEngagement,
      hasData: sync.campaigns.length > 0,
      isConnected: sync.accounts.some(acc => acc.isConnected),
      lastSync: sync.lastSync
    }
  }, [sync.campaigns, sync.accounts, sync.lastSync])

  // Get client data from admin-managed storage if user is a client
  const [adminKpiData] = useKV<{clientId: string, revenue: number, revenueGrowth: number, projects: number, projectsGrowth: number, teamMembers: number, conversations: number, conversationsGrowth: number, facebookReach: number, facebookReachGrowth: number, instagramEngagement: number, instagramEngagementGrowth: number, messagesReceived: number, messagesReceivedGrowth: number, growthRate: number}[]>('client-kpi-data', [])
  const [adminChartData] = useKV<{name: string, revenue: number, conversations: number, messagesReceived: number, facebookReach: number, instagramEngagement: number, date: string, clientId?: string}[]>('client-chart-data', [])
  const [adminProjectsData] = useKV<{id: string, name: string, client: string, status: 'in-progress' | 'review' | 'to-do' | 'completed', progress: number, deadline: string}[]>('client-projects-data', [])

  // Get KPI data - client-specific or admin aggregate
  const kpiStorageKey = user.role === 'client' ? `client-kpi-${user.id}` : 'admin-kpi'
  
  let kpiData: KPIData
  if (user.role === 'client') {
    // For clients, get data from admin-managed storage
    const clientKpi = adminKpiData.find(data => data.clientId === user.id)
    kpiData = clientKpi ? {
      ...clientKpi,
      projectBudget: clientKpi.revenue || 0, // Use revenue as budget for clients
      budgetUsed: Math.round((clientKpi.revenue || 0) * 0.7), // Assume 70% used
      messagesGrowth: clientKpi.messagesReceivedGrowth || 0
    } : {
      revenue: 0,
      revenueGrowth: 0,
      projects: 0,
      projectsGrowth: 0,
      teamMembers: 1,
      conversations: 0,
      conversationsGrowth: 0,
      facebookReach: 0,
      facebookReachGrowth: 0,
      instagramEngagement: 0,
      instagramEngagementGrowth: 0,
      messagesReceived: 0,
      messagesGrowth: 0,
      growthRate: 0,
      projectBudget: 0,
      budgetUsed: 0,
      clientId: user.id
    }
  } else {
    // For admin, use the default admin data with real-time social media data when available
    kpiData = {
      revenue: 125600,
      revenueGrowth: 12.5,
      projects: 28,
      projectsGrowth: 8.2,
      teamMembers: 12,
      conversations: 1847,
      conversationsGrowth: 23.1,
      // Use real-time data if available, otherwise fall back to defaults
      facebookReach: realTimeSocialMetrics.hasData ? realTimeSocialMetrics.facebookReach : 45200,
      facebookReachGrowth: realTimeSocialMetrics.hasData ? 25.0 : 15.3, // Show higher growth when live data is connected
      instagramEngagement: realTimeSocialMetrics.hasData ? realTimeSocialMetrics.instagramEngagement : 8.7,
      instagramEngagementGrowth: realTimeSocialMetrics.hasData ? 18.5 : 18.9, // Show growth when live data is connected
      messagesReceived: 2341,
      messagesGrowth: 19.7,
      growthRate: 16.8,
      projectBudget: 85000,
      budgetUsed: 62400
    }
  }

  // Get chart data - client-specific or admin aggregate  
  let chartData: ChartData[]
  if (user.role === 'client') {
    // For clients, get data from admin-managed storage
    chartData = adminChartData.filter(data => data.clientId === user.id)
  } else {
    // For admin, use enhanced data with connected account information
    const baseInstagramEngagement = connectedInstagramAccount?.totalEngagement 
      ? ((connectedInstagramAccount.totalEngagement / (connectedInstagramAccount.totalReach || 1)) * 100)
      : 8.0
    
    chartData = [
      {
        name: 'Week 1',
        revenue: 28400,
        conversations: 412,
        messagesReceived: 523,
        facebookReach: connectedFacebookAccount?.totalReach ? Math.floor(connectedFacebookAccount.totalReach * 0.23) : 10200,
        instagramEngagement: Math.max(baseInstagramEngagement * 0.85, 7.2),
        date: '2024-01-01'
      },
      {
        name: 'Week 2', 
        revenue: 31200,
        conversations: 456,
        messagesReceived: 578,
        facebookReach: connectedFacebookAccount?.totalReach ? Math.floor(connectedFacebookAccount.totalReach * 0.26) : 11800,
        instagramEngagement: Math.max(baseInstagramEngagement * 0.90, 8.1),
        date: '2024-01-08'
      },
      {
        name: 'Week 3',
        revenue: 33600,
        conversations: 498,
        messagesReceived: 634,
        facebookReach: connectedFacebookAccount?.totalReach ? Math.floor(connectedFacebookAccount.totalReach * 0.27) : 12400,
        instagramEngagement: Math.max(baseInstagramEngagement * 0.98, 8.8),
        date: '2024-01-15'
      },
      {
        name: 'Week 4',
        revenue: 32400,
        conversations: 481,
        messagesReceived: 606,
        facebookReach: connectedFacebookAccount?.totalReach ? Math.floor(connectedFacebookAccount.totalReach * 0.24) : 10800,
        instagramEngagement: Math.min(baseInstagramEngagement * 1.05, 12.0),
        date: '2024-01-22'
      }
    ]
  }

  // Get recent projects - client-specific or admin aggregate
  let recentProjects: RecentProject[]
  if (user.role === 'client') {
    // For clients, get data from admin-managed storage
    const clientProjects = adminProjectsData.filter(project => 
      project.client === user.name || project.client === user.id
    )
    recentProjects = clientProjects.map(project => ({
      ...project,
      team: ['GKM Team'] // Always show as GKM Team for clients
    }))
  } else {
    // For admin, use default admin projects
    recentProjects = [
      {
        id: '1',
        name: 'Bakkerij de Korenbloem - Instagram Campaign',
        client: 'De Korenbloem',
        status: 'in-progress',
        progress: 75,
        deadline: '2024-01-25',
        team: ['Alex', 'Sarah']
      },
      {
        id: '2', 
        name: 'Restaurant Bella Vista - Facebook Ads',
        client: 'Bella Vista',
        status: 'review',
        progress: 90,
        deadline: '2024-01-22',
        team: ['Mike', 'Lisa']
      },
      {
        id: '3',
        name: 'Fitness First - Social Media Strategy',
        client: 'Fitness First',
        status: 'to-do',
        progress: 25,
        deadline: '2024-02-01',
        team: ['Alex', 'Tom']
      }
    ]
  }

  const [teamMembers] = useKV<TeamMember[]>('team-members', [
    { id: '1', name: 'Alex van der Berg', role: 'Creative Director', avatar: '', isOnline: true },
    { id: '2', name: 'Sarah de Jong', role: 'Social Media Manager', avatar: '', isOnline: true },
    { id: '3', name: 'Mike Visser', role: 'Content Creator', avatar: '', isOnline: false },
    { id: '4', name: 'Lisa Bakker', role: 'Account Manager', avatar: '', isOnline: true }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-blue-500'
      case 'review': return 'bg-yellow-500'
      case 'to-do': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'in-progress': return 'In Progress'
      case 'review': return 'Review'
      case 'to-do': return 'To Do'
      default: return 'Unknown'
    }
  }

  const formatNumber = (num: number) => {
    if (!num && num !== 0) return '0'
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatValue = (value: number | undefined, isClient: boolean = false) => {
    if (isClient && (!value || value === 0)) {
      return '-'
    }
    return value || 0
  }

  const formatNumberValue = (value: number | undefined, isClient: boolean = false) => {
    if (isClient && (!value || value === 0)) {
      return '-'
    }
    return formatNumber(value || 0)
  }

  const formatPercentageValue = (value: number | undefined, isClient: boolean = false) => {
    if (isClient && (!value || value === 0)) {
      return '-'
    }
    return `${value || 0}%`
  }

  const formatGrowthValue = (value: number | undefined, isClient: boolean = false) => {
    if (isClient && (!value || value === 0)) {
      return '-'
    }
    return formatGrowth(value || 0)
  }

  const formatGrowth = (growth: number) => {
    if (!growth && growth !== 0) return '0%'
    return growth > 0 ? `+${growth}%` : `${growth}%`
  }

  const getGrowthColor = (growth: number) => {
    return growth > 0 ? 'text-green-600' : 'text-red-600'
  }

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? TrendingUp : TrendingDown
  }

  return (
    <div className="space-y-6">
      {/* Header with Admin Data Management */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            {user.role === 'admin' ? 'Welcome back! Here\'s what\'s happening with your projects.' : 'Track your project progress and performance metrics.'}
          </p>
        </div>
        {user.role === 'admin' && (
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowSocialIntegration(true)}
              className="glass-card bg-gradient-to-r from-blue-500/20 to-pink-500/20 backdrop-blur-md border-blue-500/30 text-foreground hover:from-blue-500/30 hover:to-pink-500/30 hover:border-blue-500/50 hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Link className="w-4 h-4 mr-2" />
              Connect Social Media
            </Button>
            <Button 
              onClick={() => setShowCampaignAnalytics(true)}
              className="glass-card bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-md border-green-500/30 text-foreground hover:from-green-500/30 hover:to-blue-500/30 hover:border-green-500/50 hover:text-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Campaign Analytics
            </Button>
            <Button 
              onClick={() => setShowAdminManager(true)}
              className="glass-card bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-md border-primary/30 text-foreground hover:from-primary/30 hover:to-accent/30 hover:border-primary/50 hover:text-primary transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Edit className="w-4 h-4 mr-2" />
              Manage Client Data
            </Button>
          </div>
        )}
      </div>

      {/* Show message for clients with no data */}
      {user.role === 'client' && (!kpiData || (kpiData.revenue === 0 && kpiData.conversations === 0 && kpiData.projects === 0)) && (
        <Card className="glass-card border-primary/50">
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Welcome to Your Dashboard!</h3>
            <p className="text-muted-foreground">
              Your GKM team will add your project data and analytics here. 
              Check back soon to see your performance metrics and progress updates.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Enhanced KPI Cards Grid - 8 Cards in 2x4 Layout */}
      {(user.role === 'admin' || (user.role === 'client' && kpiData && (kpiData.revenue > 0 || kpiData.conversations > 0 || kpiData.projects > 0))) && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Revenue */}
          <Card className="glass-card hover:glass-modal transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {user.role === 'client' ? 'Budget Allocated' : 'Monthly Revenue'}
              </CardTitle>
              <DollarSign className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${user.role === 'client' ? formatValue(kpiData?.revenue, true) : (kpiData?.revenue || 0).toLocaleString()}
              </div>
              <div className={`flex items-center text-xs ${getGrowthColor(kpiData?.revenueGrowth || 0)}`}>
                {React.createElement(getGrowthIcon(kpiData?.revenueGrowth || 0), { className: 'w-3 h-3 mr-1' })}
                {formatGrowthValue(kpiData?.revenueGrowth, user.role === 'client')} from last month
              </div>
            </CardContent>
          </Card>

          {/* Active Projects */}
          <Card className="glass-card hover:glass-modal transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {user.role === 'client' ? 'Your Projects' : 'Active Projects'}
              </CardTitle>
              <Target className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatValue(kpiData?.projects, user.role === 'client')}</div>
              <div className={`flex items-center text-xs ${getGrowthColor(kpiData?.projectsGrowth || 0)}`}>
                {React.createElement(getGrowthIcon(kpiData?.projectsGrowth || 0), { className: 'w-3 h-3 mr-1' })}
                {formatGrowthValue(kpiData?.projectsGrowth, user.role === 'client')} from last month
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          {user.role === 'admin' && (
            <Card className="glass-card hover:glass-modal transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Team Members</CardTitle>
                <Users className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{kpiData?.teamMembers || 0}</div>
                <div className="text-xs text-muted-foreground">
                  {(teamMembers || []).filter(m => m.isOnline).length} online now
                </div>
              </CardContent>
            </Card>
          )}

          {/* GKM Team (for clients) */}
          {user.role === 'client' && (
            <Card className="glass-card hover:glass-modal transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">GKM Team</CardTitle>
                <Users className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{(teamMembers || []).length}</div>
                <div className="text-xs text-muted-foreground">
                  {(teamMembers || []).filter(m => m.isOnline).length} online now
                </div>
              </CardContent>
            </Card>
          )}

          {/* Started Conversations - Primary KPI */}
          <Card className="glass-card border-primary/50 hover:border-primary/70 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-primary">Started Conversations</CardTitle>
              <MessageSquare className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatNumberValue(kpiData?.conversations, user.role === 'client')}</div>
              <div className={`flex items-center text-xs ${getGrowthColor(kpiData?.conversationsGrowth || 0)}`}>
                {React.createElement(getGrowthIcon(kpiData?.conversationsGrowth || 0), { className: 'w-3 h-3 mr-1' })}
                {formatGrowthValue(kpiData?.conversationsGrowth, user.role === 'client')} from last month
              </div>
            </CardContent>
          </Card>

          {/* Facebook Reach */}
          <Card className="glass-card hover:glass-modal transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Facebook Reach</CardTitle>
              <Facebook className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatNumberValue(kpiData?.facebookReach, user.role === 'client')}</div>
              <div className={`flex items-center justify-between text-xs ${getGrowthColor(kpiData?.facebookReachGrowth || 0)}`}>
                <div className="flex items-center">
                  {React.createElement(getGrowthIcon(kpiData?.facebookReachGrowth || 0), { className: 'w-3 h-3 mr-1' })}
                  {formatGrowthValue(kpiData?.facebookReachGrowth, user.role === 'client')} from last month
                </div>
                {user.role === 'admin' && realTimeSocialMetrics.isConnected && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 text-xs border-green-200">
                    Live
                  </Badge>
                )}
              </div>
              {user.role === 'admin' && realTimeSocialMetrics.lastSync && (
                <div className="text-xs text-muted-foreground mt-1">
                  Last sync: {new Date(realTimeSocialMetrics.lastSync).toLocaleTimeString()}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instagram Engagement */}
          <Card className="glass-card hover:glass-modal transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Instagram Engagement</CardTitle>
              <Instagram className="w-4 h-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatPercentageValue(kpiData?.instagramEngagement, user.role === 'client')}</div>
              <div className={`flex items-center justify-between text-xs ${getGrowthColor(kpiData?.instagramEngagementGrowth || 0)}`}>
                <div className="flex items-center">
                  {React.createElement(getGrowthIcon(kpiData?.instagramEngagementGrowth || 0), { className: 'w-3 h-3 mr-1' })}
                  {formatGrowthValue(kpiData?.instagramEngagementGrowth, user.role === 'client')} from last month
                </div>
                {user.role === 'admin' && realTimeSocialMetrics.isConnected && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 text-xs border-green-200">
                    Live
                  </Badge>
                )}
              </div>
              {user.role === 'admin' && realTimeSocialMetrics.lastSync && (
                <div className="text-xs text-muted-foreground mt-1">
                  Last sync: {new Date(realTimeSocialMetrics.lastSync).toLocaleTimeString()}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Messages Received */}
          <Card className="glass-card hover:glass-modal transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Messages Received</CardTitle>
              <Eye className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatNumberValue(kpiData?.messagesReceived, user.role === 'client')}</div>
              <div className={`flex items-center text-xs ${getGrowthColor(kpiData?.messagesGrowth || 0)}`}>
                {React.createElement(getGrowthIcon(kpiData?.messagesGrowth || 0), { className: 'w-3 h-3 mr-1' })}
                {formatGrowthValue(kpiData?.messagesGrowth, user.role === 'client')} from last month
              </div>
            </CardContent>
          </Card>

          {/* Growth Rate */}
          <Card className="glass-card hover:glass-modal transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overall Growth</CardTitle>
              <BarChart3 className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{formatPercentageValue(kpiData?.growthRate, user.role === 'client')}</div>
              <div className="text-xs text-muted-foreground">
                Multi-metric calculation
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Advanced Chart Analytics */}
      {(user.role === 'admin' || (user.role === 'client' && chartData && chartData.length > 0)) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Analytics Chart */}
          <Card className="glass-card col-span-1 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">Analytics Overview</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {user.role === 'client' ? 'Track your campaign performance over time' : 'Track your key performance metrics over time'}
                </p>
              </div>
              <div className="flex gap-2">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="quarter">Quarter</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedChart} onValueChange={setSelectedChart}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">{user.role === 'client' ? 'Budget' : 'Revenue'}</SelectItem>
                    <SelectItem value="conversations">Conversations</SelectItem>
                    <SelectItem value="messages">Messages</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedChart} onValueChange={setSelectedChart}>
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="revenue">{user.role === 'client' ? 'Budget' : 'Revenue'}</TabsTrigger>
                  <TabsTrigger value="conversations">Leads</TabsTrigger>
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                  <TabsTrigger value="social">Social</TabsTrigger>
                </TabsList>
                
                {/* Simulated Chart Area */}
                <div className="h-80 bg-muted/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg"></div>
                  <div className="text-center z-10">
                    <div className="mb-4">
                      {selectedChart === 'revenue' && <LineChart className="w-16 h-16 mx-auto text-primary" />}
                      {selectedChart === 'conversations' && <BarChart3 className="w-16 h-16 mx-auto text-accent" />}
                      {selectedChart === 'messages' && <MessageSquare className="w-16 h-16 mx-auto text-blue-500" />}
                      {selectedChart === 'social' && <TrendingUp className="w-16 h-16 mx-auto text-green-500" />}
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      {selectedChart === 'revenue' && (user.role === 'client' ? 'Budget Tracker' : 'Income Tracker')}
                      {selectedChart === 'conversations' && 'Lead Generation Analytics'}
                      {selectedChart === 'messages' && 'Message Flow Analysis'}
                      {selectedChart === 'social' && 'Social Media Performance'}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      {selectedChart === 'revenue' && (user.role === 'client' ? 'Track budget usage and campaign spend over time' : 'Track revenue trends with gradient fill and interactive hover tooltips')}
                      {selectedChart === 'conversations' && 'Compare messages received vs started conversations with conversion rates'}
                      {selectedChart === 'messages' && 'Monitor message volume and response times'}
                      {selectedChart === 'social' && 'Facebook reach and Instagram engagement trends'}
                    </p>
                    
                    {/* Sample Data Points */}
                    <div className="flex justify-center gap-8 mt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {selectedChart === 'revenue' && chartData && chartData.length > 0 && `$${chartData[chartData.length - 1]?.revenue?.toLocaleString() || '0'}`}
                          {selectedChart === 'conversations' && chartData && chartData.length > 0 && (chartData[chartData.length - 1]?.conversations || 0)}
                          {selectedChart === 'messages' && chartData && chartData.length > 0 && (chartData[chartData.length - 1]?.messagesReceived || 0)}
                          {selectedChart === 'social' && chartData && chartData.length > 0 && `${chartData[chartData.length - 1]?.instagramEngagement || 0}%`}
                        </div>
                        <div className="text-xs text-muted-foreground">Current Period</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent">
                          {selectedChart === 'revenue' && '+12.5%'}
                          {selectedChart === 'conversations' && '+23.1%'}
                          {selectedChart === 'messages' && '+19.7%'}
                          {selectedChart === 'social' && '+18.9%'}
                        </div>
                        <div className="text-xs text-muted-foreground">Growth Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Real-time Updates & Performance Insights */}
      {(user.role === 'admin' || (user.role === 'client' && kpiData && (kpiData.revenue > 0 || kpiData.conversations > 0))) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Conversion Metrics */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Lead Conversion</CardTitle>
              <p className="text-sm text-muted-foreground">Messages to conversations ratio</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Messages Received</span>
                <span className="font-semibold text-foreground">{(kpiData?.messagesReceived || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Started Conversations</span>
                <span className="font-semibold text-primary">{(kpiData?.conversations || 0).toLocaleString()}</span>
              </div>
              <Progress 
                value={((kpiData?.conversations || 0) / (kpiData?.messagesReceived || 1)) * 100}
                className="h-2"
              />
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {Math.round(((kpiData?.conversations || 0) / (kpiData?.messagesReceived || 1)) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Conversion Rate</div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media Performance */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Social Performance</CardTitle>
              <p className="text-sm text-muted-foreground">Platform comparison</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Facebook</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">{formatNumber(kpiData?.facebookReach || 0)}</div>
                  <div className="text-xs text-muted-foreground">Reach</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span className="text-sm">Instagram</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">{kpiData?.instagramEngagement || 0}%</div>
                  <div className="text-xs text-muted-foreground">Engagement</div>
                </div>
              </div>
              <div className="pt-2">
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Combined Performance</span>
                  <span className="text-xs font-semibold text-accent">
                    {kpiData?.facebookReach && kpiData.instagramEngagement ? 'Excellent' : 'Getting Started'}
                  </span>
                </div>
                <Progress value={kpiData?.facebookReach && kpiData.instagramEngagement ? 85 : 25} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Team Activity or Client Support */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                {user.role === 'admin' ? 'Team Activity' : 'Your GKM Team'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {user.role === 'admin' ? 'Real-time status' : 'Available support'}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(teamMembers || []).slice(0, 4).map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {member.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-background"></div>
                        )}
                      </div>
                      <span className="text-sm text-foreground">{member.name.split(' ')[0]}</span>
                    </div>
                    <Badge variant={member.isOnline ? "default" : "secondary"} className="text-xs">
                      {member.isOnline ? 'Online' : 'Away'}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {user.role === 'admin' ? 'Team Utilization' : 'Team Availability'}
                  </span>
                  <span className="font-semibold text-foreground">
                    {user.role === 'admin' ? '87%' : `${(teamMembers || []).filter(m => m.isOnline).length}/${(teamMembers || []).length}`}
                  </span>
                </div>
                <Progress value={user.role === 'admin' ? 87 : ((teamMembers || []).filter(m => m.isOnline).length / (teamMembers || []).length) * 100} className="h-2 mt-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Facebook Campaign Insights - Admin Only */}
      {user.role === 'admin' && connectedFacebookAccount && connectedFacebookAccount.campaigns && (
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Facebook className="w-5 h-5 text-blue-600" />
              <CardTitle>Facebook Campaign Insights</CardTitle>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-300">
              <CheckCircle className="w-3 h-3 mr-1" />
              {connectedFacebookAccount.campaigns.length} campaigns active
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 bg-blue-50/50 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Total Ad Spend</p>
                    <p className="text-2xl font-bold text-blue-700">
                      ${connectedFacebookAccount.totalSpend?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600 opacity-70" />
                </div>
              </Card>
              <Card className="p-4 bg-green-50/50 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Total Reach</p>
                    <p className="text-2xl font-bold text-green-700">
                      {connectedFacebookAccount.totalReach?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-green-600 opacity-70" />
                </div>
              </Card>
              <Card className="p-4 bg-purple-50/50 border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600">Conversions</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {connectedFacebookAccount.totalConversions || '0'}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-purple-600 opacity-70" />
                </div>
              </Card>
              <Card className="p-4 bg-orange-50/50 border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600">Active Campaigns</p>
                    <p className="text-2xl font-bold text-orange-700">
                      {connectedFacebookAccount.campaigns.filter(c => c.status === 'active').length}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600 opacity-70" />
                </div>
              </Card>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Top Performing Campaigns</h4>
              {connectedFacebookAccount.campaigns
                .sort((a, b) => b.conversions - a.conversions)
                .slice(0, 3)
                .map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        campaign.status === 'active' ? 'bg-green-500' : 
                        campaign.status === 'paused' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}></div>
                      <div>
                        <div className="font-medium text-sm">{campaign.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {campaign.conversions} conversions • ${campaign.spent.toLocaleString()} spent
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{campaign.ctr}% CTR</div>
                      <div className="text-xs text-muted-foreground">${campaign.cpc} CPC</div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowFacebookModal(true)}
                className="hover:bg-blue-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Facebook Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Recent Projects & Budget Overview */}
      {(user.role === 'admin' || (user.role === 'client' && (recentProjects?.length || 0) > 0)) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects with Enhanced Details */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {user.role === 'client' ? 'Your Projects' : 'Recent Projects'}
                </CardTitle>
                <p className="text-sm text-muted-foreground">Latest project updates and progress</p>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {(recentProjects || []).map((project) => (
                <div key={project.id} className="group p-4 rounded-lg hover:bg-muted/30 cursor-pointer transition-all duration-200 border border-transparent hover:border-border">
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${getStatusColor(project.status)}`}></div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
                            {project.name}
                          </h4>
                          {user.role === 'admin' && (
                            <p className="text-xs text-muted-foreground">{project.client}</p>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {getStatusText(project.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Progress value={project.progress} className="w-20 h-1.5" />
                          <span className="text-xs text-muted-foreground">{project.progress}%</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {project.deadline}
                        </div>
                      </div>
                      {user.role === 'admin' && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{project.team.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {(recentProjects || []).length === 0 && user.role === 'client' && (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p>No projects yet. Your GKM team will add your projects here soon.</p>
                </div>
              )}
              <Button variant="ghost" className="w-full mt-4">
                View All Projects
                <ArrowUp className="w-4 h-4 ml-2 rotate-45" />
              </Button>
            </CardContent>
          </Card>

          {/* Project Budget Overview with Enhanced Details */}
          <Card className="glass-card">
            <CardHeader>
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {user.role === 'client' ? 'Budget Overview' : 'Budget Overview'}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {user.role === 'client' ? 'Your allocated budget and usage' : 'Financial performance and allocation'}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget Used</span>
                  <span className="font-medium text-foreground">${(kpiData?.budgetUsed || 0).toLocaleString()} / ${(kpiData?.projectBudget || 0).toLocaleString()}</span>
                </div>
                <Progress 
                  value={((kpiData?.budgetUsed || 0) / (kpiData?.projectBudget || 1)) * 100} 
                  className="h-3"
                />
                <div className="text-xs text-muted-foreground">
                  {Math.round(((kpiData?.budgetUsed || 0) / (kpiData?.projectBudget || 1)) * 100)}% of total budget allocated
                </div>
              </div>

              {kpiData?.projectBudget && kpiData.projectBudget > 0 && (
                <>
                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-foreground">Budget Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {user.role === 'client' ? 'Campaign Development' : 'Active Projects'}
                        </span>
                        <span className="font-medium">${Math.round((kpiData?.budgetUsed || 0) * 0.6).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {user.role === 'client' ? 'Content Creation' : 'Team Resources'}
                        </span>
                        <span className="font-medium">${Math.round((kpiData?.budgetUsed || 0) * 0.3).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {user.role === 'client' ? 'Platform Tools' : 'Marketing Tools'}
                        </span>
                        <span className="font-medium">${Math.round((kpiData?.budgetUsed || 0) * 0.1).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/20 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Remaining Budget</span>
                      <span className="text-lg font-bold text-accent">${((kpiData?.projectBudget || 0) - (kpiData?.budgetUsed || 0)).toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {user.role === 'client' ? 'Available for upcoming campaigns' : 'Available for new projects'}
                    </div>
                  </div>
                </>
              )}

              {(!kpiData?.projectBudget || kpiData.projectBudget === 0) && user.role === 'client' && (
                <div className="text-center py-6 text-muted-foreground">
                  <DollarSign className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p>Budget information will be available once your GKM team sets up your campaigns.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin Data Manager Modal */}
      {showAdminManager && user.role === 'admin' && (
        <AdminDataManager 
          open={showAdminManager}
          onOpenChange={setShowAdminManager}
        />
      )}

      {/* Social Media Integration Modal */}
      {user.role === 'admin' && showSocialIntegration && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-modal w-full max-w-4xl max-h-[90vh] overflow-auto rounded-xl border border-white/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Social Media Integration</h2>
                  <p className="text-muted-foreground">Connect and sync your Facebook and Instagram ad accounts</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSocialIntegration(false)}
                  className="bg-white/10 border-white/20 hover:bg-white/20"
                >
                  Close
                </Button>
              </div>
              <SocialMediaIntegration isAdmin={true} />
            </div>
          </div>
        </div>
      )}

      {/* Campaign Analytics Modal */}
      {user.role === 'admin' && showCampaignAnalytics && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-modal w-full max-w-7xl max-h-[90vh] overflow-auto rounded-xl border border-white/20">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Campaign Analytics</h2>
                  <p className="text-muted-foreground">Real-time performance data from connected social media accounts</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCampaignAnalytics(false)}
                  className="bg-white/10 border-white/20 hover:bg-white/20"
                >
                  Close
                </Button>
              </div>
              <CampaignAnalytics />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}