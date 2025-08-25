import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { User } from '../App'
import { 
  Users, 
  DollarSign, 
  Target, 
  MessageSquare, 
  Facebook, 
  Instagram,
  BarChart3,
  Save,
  Plus,
  Edit,
  Trash2,
  Search
} from 'lucide-react'

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
  clientId?: string
}

interface ChartData {
  name: string
  revenue: number
  conversations: number
  messagesReceived: number
  facebookReach: number
  instagramEngagement: number
  date: string
  clientId?: string
}

interface RecentProject {
  id: string
  name: string
  client: string
  status: 'in-progress' | 'review' | 'to-do' | 'completed'
  progress: number
  deadline: string
  team: string[]
}

interface AdminDataManagerProps {
  onClose: () => void
}

export function AdminDataManager({ onClose }: AdminDataManagerProps) {
  const [selectedClient, setSelectedClient] = useState<string>('')
  const [searchClient, setSearchClient] = useState('')
  const [activeTab, setActiveTab] = useState('kpis')

  // Get all users to show clients
  const [allUsers] = useKV<User[]>('all-users', [])
  const clients = allUsers.filter(user => user.role === 'client')
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchClient.toLowerCase()) ||
    client.email.toLowerCase().includes(searchClient.toLowerCase())
  )

  // KPI Data Management
  const [kpiData, setKpiData] = useKV<KPIData>(`client-kpi-${selectedClient}`, {
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
    clientId: selectedClient
  })

  // Chart Data Management
  const [chartData, setChartData] = useKV<ChartData[]>(`client-chart-${selectedClient}`, [])

  // Projects Data Management
  const [projectsData, setProjectsData] = useKV<RecentProject[]>(`client-projects-${selectedClient}`, [])

  const [newProject, setNewProject] = useState<Partial<RecentProject>>({
    name: '',
    client: '',
    status: 'to-do',
    progress: 0,
    deadline: '',
    team: []
  })

  const handleSaveKPIs = () => {
    if (!selectedClient) {
      toast.error('Please select a client first')
      return
    }

    setKpiData({
      ...kpiData,
      clientId: selectedClient
    })
    toast.success('Client KPI data saved successfully!')
  }

  const handleAddChartDataPoint = () => {
    if (!selectedClient) {
      toast.error('Please select a client first')
      return
    }

    const newDataPoint: ChartData = {
      name: `Week ${chartData.length + 1}`,
      revenue: 0,
      conversations: 0,
      messagesReceived: 0,
      facebookReach: 0,
      instagramEngagement: 0,
      date: new Date().toISOString().split('T')[0],
      clientId: selectedClient
    }

    setChartData([...chartData, newDataPoint])
    toast.success('New chart data point added!')
  }

  const handleUpdateChartData = (index: number, field: string, value: number) => {
    const updatedData = [...chartData]
    updatedData[index] = { ...updatedData[index], [field]: value }
    setChartData(updatedData)
  }

  const handleAddProject = () => {
    if (!selectedClient || !newProject.name) {
      toast.error('Please select a client and enter project name')
      return
    }

    const project: RecentProject = {
      id: Date.now().toString(),
      name: newProject.name || '',
      client: clients.find(c => c.id === selectedClient)?.name || '',
      status: newProject.status || 'to-do',
      progress: newProject.progress || 0,
      deadline: newProject.deadline || '',
      team: newProject.team || []
    }

    setProjectsData([...projectsData, project])
    setNewProject({
      name: '',
      client: '',
      status: 'to-do',
      progress: 0,
      deadline: '',
      team: []
    })
    toast.success('Project added successfully!')
  }

  const handleDeleteProject = (projectId: string) => {
    setProjectsData(projectsData.filter(p => p.id !== projectId))
    toast.success('Project deleted successfully!')
  }

  const selectedClientData = clients.find(c => c.id === selectedClient)

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="glass-modal max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Manage Client Dashboard Data</DialogTitle>
          <DialogDescription>
            Add and update KPI data, chart metrics, and projects for your clients.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Selection */}
          <div className="space-y-3">
            <Label>Select Client</Label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  value={searchClient}
                  onChange={(e) => setSearchClient(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a client to manage data for..." />
              </SelectTrigger>
              <SelectContent>
                {filteredClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>{client.name}</span>
                      <span className="text-xs text-muted-foreground">({client.email})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedClient && selectedClientData && (
            <Card className="glass-card border-primary/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedClientData.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedClientData.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedClient && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="kpis">KPI Metrics</TabsTrigger>
                <TabsTrigger value="charts">Chart Data</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>

              {/* KPI Management */}
              <TabsContent value="kpis" className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Client KPI Dashboard Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Financial Metrics
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <Label>Monthly Revenue ($)</Label>
                            <Input
                              type="number"
                              value={kpiData?.revenue || 0}
                              onChange={(e) => setKpiData(prev => ({ ...prev, revenue: parseFloat(e.target.value) || 0 }))}
                            />
                          </div>
                          <div>
                            <Label>Revenue Growth (%)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={kpiData?.revenueGrowth || 0}
                              onChange={(e) => setKpiData(prev => ({ ...prev, revenueGrowth: parseFloat(e.target.value) || 0 }))}
                            />
                          </div>
                          <div>
                            <Label>Project Budget ($)</Label>
                            <Input
                              type="number"
                              value={kpiData?.projectBudget || 0}
                              onChange={(e) => setKpiData(prev => ({ ...prev, projectBudget: parseFloat(e.target.value) || 0 }))}
                            />
                          </div>
                          <div>
                            <Label>Budget Used ($)</Label>
                            <Input
                              type="number"
                              value={kpiData?.budgetUsed || 0}
                              onChange={(e) => setKpiData(prev => ({ ...prev, budgetUsed: parseFloat(e.target.value) || 0 }))}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Engagement Metrics
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <Label>Started Conversations</Label>
                            <Input
                              type="number"
                              value={kpiData?.conversations || 0}
                              onChange={(e) => setKpiData(prev => ({ ...prev, conversations: parseFloat(e.target.value) || 0 }))}
                            />
                          </div>
                          <div>
                            <Label>Conversations Growth (%)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={kpiData?.conversationsGrowth || 0}
                              onChange={(e) => setKpiData(prev => ({ ...prev, conversationsGrowth: parseFloat(e.target.value) || 0 }))}
                            />
                          </div>
                          <div>
                            <Label>Messages Received</Label>
                            <Input
                              type="number"
                              value={kpiData?.messagesReceived || 0}
                              onChange={(e) => setKpiData(prev => ({ ...prev, messagesReceived: parseFloat(e.target.value) || 0 }))}
                            />
                          </div>
                          <div>
                            <Label>Messages Growth (%)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={kpiData?.messagesGrowth || 0}
                              onChange={(e) => setKpiData(prev => ({ ...prev, messagesGrowth: parseFloat(e.target.value) || 0 }))}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Facebook className="w-4 h-4 text-blue-600" />
                          Facebook Metrics
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <Label>Facebook Reach</Label>
                            <Input
                              type="number"
                              value={kpiData?.facebookReach || 0}
                              onChange={(e) => setKpiData(prev => ({ ...prev, facebookReach: parseFloat(e.target.value) || 0 }))}
                            />
                          </div>
                          <div>
                            <Label>Facebook Reach Growth (%)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={kpiData?.facebookReachGrowth || 0}
                              onChange={(e) => setKpiData(prev => ({ ...prev, facebookReachGrowth: parseFloat(e.target.value) || 0 }))}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Instagram className="w-4 h-4 text-pink-600" />
                          Instagram Metrics
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <Label>Instagram Engagement (%)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={kpiData?.instagramEngagement || 0}
                              onChange={(e) => setKpiData(prev => ({ ...prev, instagramEngagement: parseFloat(e.target.value) || 0 }))}
                            />
                          </div>
                          <div>
                            <Label>Instagram Growth (%)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={kpiData?.instagramEngagementGrowth || 0}
                              onChange={(e) => setKpiData(prev => ({ ...prev, instagramEngagementGrowth: parseFloat(e.target.value) || 0 }))}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label>Active Projects Count</Label>
                        <Input
                          type="number"
                          value={kpiData?.projects || 0}
                          onChange={(e) => setKpiData(prev => ({ ...prev, projects: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div className="space-y-3">
                        <Label>Overall Growth Rate (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={kpiData?.growthRate || 0}
                          onChange={(e) => setKpiData(prev => ({ ...prev, growthRate: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSaveKPIs} className="bg-primary text-primary-foreground">
                        <Save className="w-4 h-4 mr-2" />
                        Save KPI Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Chart Data Management */}
              <TabsContent value="charts" className="space-y-6">
                <Card className="glass-card">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Chart Data Points</CardTitle>
                    <Button onClick={handleAddChartDataPoint} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Data Point
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {chartData.map((dataPoint, index) => (
                        <Card key={index} className="p-4">
                          <div className="grid grid-cols-6 gap-4">
                            <div>
                              <Label>Period</Label>
                              <Input
                                value={dataPoint.name}
                                onChange={(e) => {
                                  const updatedData = [...chartData]
                                  updatedData[index].name = e.target.value
                                  setChartData(updatedData)
                                }}
                              />
                            </div>
                            <div>
                              <Label>Revenue</Label>
                              <Input
                                type="number"
                                value={dataPoint.revenue}
                                onChange={(e) => handleUpdateChartData(index, 'revenue', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <div>
                              <Label>Conversations</Label>
                              <Input
                                type="number"
                                value={dataPoint.conversations}
                                onChange={(e) => handleUpdateChartData(index, 'conversations', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <div>
                              <Label>Messages</Label>
                              <Input
                                type="number"
                                value={dataPoint.messagesReceived}
                                onChange={(e) => handleUpdateChartData(index, 'messagesReceived', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <div>
                              <Label>FB Reach</Label>
                              <Input
                                type="number"
                                value={dataPoint.facebookReach}
                                onChange={(e) => handleUpdateChartData(index, 'facebookReach', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <div>
                              <Label>IG Engagement</Label>
                              <Input
                                type="number"
                                step="0.1"
                                value={dataPoint.instagramEngagement}
                                onChange={(e) => handleUpdateChartData(index, 'instagramEngagement', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                      {chartData.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No chart data points yet. Add some to get started.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Projects Management */}
              <TabsContent value="projects" className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Add New Project</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label>Project Name</Label>
                        <Input
                          value={newProject.name || ''}
                          onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter project name..."
                        />
                      </div>
                      <div className="space-y-3">
                        <Label>Status</Label>
                        <Select 
                          value={newProject.status || 'to-do'} 
                          onValueChange={(value: any) => setNewProject(prev => ({ ...prev, status: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="to-do">To Do</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label>Progress (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={newProject.progress || 0}
                          onChange={(e) => setNewProject(prev => ({ ...prev, progress: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div className="space-y-3">
                        <Label>Deadline</Label>
                        <Input
                          type="date"
                          value={newProject.deadline || ''}
                          onChange={(e) => setNewProject(prev => ({ ...prev, deadline: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button onClick={handleAddProject}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Current Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {projectsData.map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{project.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Status: {project.status} • Progress: {project.progress}% • Deadline: {project.deadline}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {projectsData.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No projects added yet.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}