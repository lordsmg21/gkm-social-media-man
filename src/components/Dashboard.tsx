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
  PieChart
} from 'lucide-react'
import { User } from '../App'
import { useKV } from '@github/spark/hooks'

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
}

interface ChartData {
  name: string
  revenue: number
  conversations: number
  messagesReceived: number
  facebookReach: number
  instagramEngagement: number
  date: string
}

interface DashboardProps {
  user: User
}

export function Dashboard({ user }: DashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedChart, setSelectedChart] = useState('revenue')

  const [kpiData] = useKV<KPIData>('dashboard-kpi', {
    revenue: 125600,
    revenueGrowth: 12.5,
    projects: 28,
    projectsGrowth: 8.2,
    teamMembers: 12,
    conversations: 1847,
    conversationsGrowth: 23.1,
    facebookReach: 45200,
    facebookReachGrowth: 15.3,
    instagramEngagement: 8.7,
    instagramEngagementGrowth: 18.9,
    messagesReceived: 2341,
    messagesGrowth: 19.7,
    growthRate: 16.8,
    projectBudget: 85000,
    budgetUsed: 62400
  })

  const [chartData] = useKV<ChartData[]>('chart-data', [
    {
      name: 'Week 1',
      revenue: 28400,
      conversations: 412,
      messagesReceived: 523,
      facebookReach: 10200,
      instagramEngagement: 7.2,
      date: '2024-01-01'
    },
    {
      name: 'Week 2', 
      revenue: 31200,
      conversations: 456,
      messagesReceived: 578,
      facebookReach: 11800,
      instagramEngagement: 8.1,
      date: '2024-01-08'
    },
    {
      name: 'Week 3',
      revenue: 33600,
      conversations: 498,
      messagesReceived: 634,
      facebookReach: 12400,
      instagramEngagement: 8.8,
      date: '2024-01-15'
    },
    {
      name: 'Week 4',
      revenue: 32400,
      conversations: 481,
      messagesReceived: 606,
      facebookReach: 10800,
      instagramEngagement: 8.9,
      date: '2024-01-22'
    }
  ])

  const [recentProjects] = useKV<RecentProject[]>('recent-projects', [
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
  ])

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
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          {user.role === 'admin' ? 'Welcome back! Here\'s what\'s happening with your projects.' : 'Track your project progress and team communication.'}
        </p>
      </div>

      {/* Enhanced KPI Cards Grid - 8 Cards in 2x4 Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Revenue */}
        <Card className="glass-card hover:glass-modal transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${(kpiData?.revenue || 0).toLocaleString()}</div>
            <div className={`flex items-center text-xs ${getGrowthColor(kpiData?.revenueGrowth || 0)}`}>
              {React.createElement(getGrowthIcon(kpiData?.revenueGrowth || 0), { className: 'w-3 h-3 mr-1' })}
              {formatGrowth(kpiData?.revenueGrowth || 0)} from last month
            </div>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card className="glass-card hover:glass-modal transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
            <Target className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{kpiData?.projects || 0}</div>
            <div className={`flex items-center text-xs ${getGrowthColor(kpiData?.projectsGrowth || 0)}`}>
              {React.createElement(getGrowthIcon(kpiData?.projectsGrowth || 0), { className: 'w-3 h-3 mr-1' })}
              {formatGrowth(kpiData?.projectsGrowth || 0)} from last month
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
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

        {/* Started Conversations - Primary KPI */}
        <Card className="glass-card border-primary/50 hover:border-primary/70 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary">Started Conversations</CardTitle>
            <MessageSquare className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatNumber(kpiData?.conversations || 0)}</div>
            <div className={`flex items-center text-xs ${getGrowthColor(kpiData?.conversationsGrowth || 0)}`}>
              {React.createElement(getGrowthIcon(kpiData?.conversationsGrowth || 0), { className: 'w-3 h-3 mr-1' })}
              {formatGrowth(kpiData?.conversationsGrowth || 0)} from last month
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
            <div className="text-2xl font-bold text-foreground">{formatNumber(kpiData?.facebookReach || 0)}</div>
            <div className={`flex items-center text-xs ${getGrowthColor(kpiData?.facebookReachGrowth || 0)}`}>
              {React.createElement(getGrowthIcon(kpiData?.facebookReachGrowth || 0), { className: 'w-3 h-3 mr-1' })}
              {formatGrowth(kpiData?.facebookReachGrowth || 0)} from last month
            </div>
          </CardContent>
        </Card>

        {/* Instagram Engagement */}
        <Card className="glass-card hover:glass-modal transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Instagram Engagement</CardTitle>
            <Instagram className="w-4 h-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{kpiData?.instagramEngagement || 0}%</div>
            <div className={`flex items-center text-xs ${getGrowthColor(kpiData?.instagramEngagementGrowth || 0)}`}>
              {React.createElement(getGrowthIcon(kpiData?.instagramEngagementGrowth || 0), { className: 'w-3 h-3 mr-1' })}
              {formatGrowth(kpiData?.instagramEngagementGrowth || 0)} from last month
            </div>
          </CardContent>
        </Card>

        {/* Messages Received */}
        <Card className="glass-card hover:glass-modal transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Messages Received</CardTitle>
            <Eye className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatNumber(kpiData?.messagesReceived || 0)}</div>
            <div className={`flex items-center text-xs ${getGrowthColor(kpiData?.messagesGrowth || 0)}`}>
              {React.createElement(getGrowthIcon(kpiData?.messagesGrowth || 0), { className: 'w-3 h-3 mr-1' })}
              {formatGrowth(kpiData?.messagesGrowth || 0)} from last month
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
            <div className="text-2xl font-bold text-accent">{kpiData?.growthRate || 0}%</div>
            <div className="text-xs text-muted-foreground">
              Multi-metric calculation
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Chart Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Analytics Chart */}
        <Card className="glass-card col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">Analytics Overview</CardTitle>
              <p className="text-sm text-muted-foreground">Track your key performance metrics over time</p>
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
                  <SelectItem value="revenue">Revenue</SelectItem>
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
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
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
                    {selectedChart === 'revenue' && 'Income Tracker'}
                    {selectedChart === 'conversations' && 'Lead Generation Analytics'}
                    {selectedChart === 'messages' && 'Message Flow Analysis'}
                    {selectedChart === 'social' && 'Social Media Performance'}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    {selectedChart === 'revenue' && 'Track revenue trends with gradient fill and interactive hover tooltips'}
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

      {/* Real-time Updates & Performance Insights */}
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
                <span className="text-xs font-semibold text-accent">Excellent</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Team Activity */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Team Activity</CardTitle>
            <p className="text-sm text-muted-foreground">Real-time status</p>
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
                <span className="text-muted-foreground">Team Utilization</span>
                <span className="font-semibold text-foreground">87%</span>
              </div>
              <Progress value={87} className="h-2 mt-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Recent Projects & Budget Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects with Enhanced Details */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">Recent Projects</CardTitle>
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
                        <p className="text-xs text-muted-foreground">{project.client}</p>
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
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{project.team.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
              <CardTitle className="text-lg font-semibold text-foreground">Budget Overview</CardTitle>
              <p className="text-sm text-muted-foreground">Financial performance and allocation</p>
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

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium text-sm text-foreground">Budget Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Active Projects</span>
                  <span className="font-medium">$38,400</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Team Resources</span>
                  <span className="font-medium">$18,200</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Marketing Tools</span>
                  <span className="font-medium">$5,800</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/20 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Remaining Budget</span>
                <span className="text-lg font-bold text-accent">${((kpiData?.projectBudget || 0) - (kpiData?.budgetUsed || 0)).toLocaleString()}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Available for new projects</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}