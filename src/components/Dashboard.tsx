import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Facebook, 
  Instagram, 
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal
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
  instagramEngagement: number
  projectBudget: number
  budgetUsed: number
}

interface DashboardProps {
  user: User
}

export function Dashboard({ user }: DashboardProps) {
  const [kpiData] = useKV<KPIData>('dashboard-kpi', {
    revenue: 125600,
    revenueGrowth: 12.5,
    projects: 28,
    projectsGrowth: 8.2,
    teamMembers: 12,
    conversations: 1847,
    conversationsGrowth: 23.1,
    facebookReach: 45200,
    instagramEngagement: 8.7,
    projectBudget: 85000,
    budgetUsed: 62400
  })

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

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Revenue */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">€{kpiData.revenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{kpiData.revenueGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
            <Target className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{kpiData.projects}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{kpiData.projectsGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Team Members</CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{kpiData.teamMembers}</div>
            <div className="text-xs text-muted-foreground">
              {teamMembers.filter(m => m.isOnline).length} online now
            </div>
          </CardContent>
        </Card>

        {/* Started Conversations - Primary KPI */}
        <Card className="glass-card border-primary/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary">Started Conversations</CardTitle>
            <MessageSquare className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{kpiData.conversations.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{kpiData.conversationsGrowth}% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social Media Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">Facebook Reach</CardTitle>
            <Facebook className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-2">{kpiData.facebookReach.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">People reached this month</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">Instagram Engagement</CardTitle>
            <Instagram className="w-5 h-5 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-2">{kpiData.instagramEngagement}%</div>
            <div className="text-sm text-muted-foreground">Average engagement rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Project Budget Tracker */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Project Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Budget Used</span>
              <span className="font-medium text-foreground">€{kpiData.budgetUsed.toLocaleString()} / €{kpiData.projectBudget.toLocaleString()}</span>
            </div>
            <Progress 
              value={(kpiData.budgetUsed / kpiData.projectBudget) * 100} 
              className="h-3"
            />
            <div className="text-xs text-muted-foreground">
              {Math.round((kpiData.budgetUsed / kpiData.projectBudget) * 100)}% of total budget allocated
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Projects & Team */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">Recent Projects</CardTitle>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <div className={`w-3 h-3 rounded-full mt-1 ${getStatusColor(project.status)}`}></div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-foreground truncate">{project.name}</h4>
                  <p className="text-xs text-muted-foreground">{project.client}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Progress value={project.progress} className="w-16 h-1" />
                      <span className="text-xs text-muted-foreground">{project.progress}%</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {getStatusText(project.status)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {project.deadline}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">Let's Connect</CardTitle>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {member.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-foreground">{member.name}</h4>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}